import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { GameArea } from 'src/app/models/game-model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('fade-in', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('400ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  // Track currently hovered area for UI feedback
  currentAreaText: string =
    "You're in the manager's office. Look around for clues.";
  onLandingPage = true;
  rotatedDialog = false;
  showAlert = false;
  breakroomUnlocked = false;
  officeroomUnlocked = false;
  pageIndex = 0;
  dialog: string = '';
  textList: string[] = [
    "You're an employee at F.O.R.D.D ...",
    "Short for 'Fix Or Repair Daily Driver'.",
    'Your manager, Fim Jarley, has locked you in the office ' +
    "because the vehicle launch was a complete disaster.",
    "He says you're not leaving till it's fixed...",    
    "It's time to escape!",
  ];

  exitTextList: string[] = [
    'You made it out!',
    'Freedom at last.',
    'The corporate nightmare is over.',
    'Time to celebrate your escape!',
  ];

  isExitDialogActive: boolean = false;

  showInput = true;
  showCharacterIntroductions = false;
  showMonologue = false;
  currentRoom: string = 'landing';
  showModal = false;
  modalScreen: 'default' | 'password' | 'special' | 'clue' | string = 'default';
  modalHeader = '';
  modalBody = '';
  modalImage?: string;
  userInput: string = '';
  showSpecialMessage = false;
  turnOffNextPage: boolean = false;
  modalList: string[] = [];
  isGameOver: boolean = false;
  janitorComputerUnlocked: boolean = false;

  private roomDescriptions: Record<string, string> = {
    base: "You're in the main office area.",
    manager_office: "You're in the manager's office. Look around for clues.",
    dining_room: "You're in the break room. Look around for clues.",
    janitor_closet: "You're in the janitor's closet. Look around for clues.",
  };

  // Listen for Enter key to progress dialogue or submit modal input
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    // If modal is open with input, submit it
    if (this.showModal && this.showInput) {
      event.preventDefault();
      this.submitPassword();
      return;
    }
    // If not on landing page and no modal, progress dialogue
    if (!this.onLandingPage && !this.showModal) {
      this.nextPage();
    }
  }

  // Listen for Escape key to close modal
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.showModal) {
      event.preventDefault();
      this.closeModal();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor() {}

  hoveredArea: string | null = null;

  onAreaClick(areaId: string, event: Event) {
    event.preventDefault();

    const area = GameArea.getArea(areaId);
    this.showSpecialMessage = false;
    this.showInput = false;
    if (area) {
      // Use a switch on the areaId so behavior is stable even if titles change
      switch (areaId) {
        case 'computer':
          // In the janitor closet the computer prompts for a password
          if(!this.janitorComputerUnlocked){
          this.modalScreen = 'password';
          this.modalHeader = 'Computer Password Required';
          this.modalBody = 'The computer is asking for an password.';
          this.showModal = true;
          this.showInput = true;}
          else{
          this.modalScreen = 'password';
          this.modalHeader = 'Welcome Janitor';
          this.modalBody = 'Cleaning schedule started. All the other doors in the building are now unlocked.';
          this.showModal = true;
          }
          break;
        case 'keypad':
          // In the janitor closet the computer prompts for a password
          this.modalScreen = 'keypad';
          this.modalHeader = 'Escape Door Password Required';
          this.modalBody = 'Enter the escape door password to get out.';
          this.showModal = true;
          this.showInput = true;
          break;
        case 'vending_machine':
          this.modalScreen = 'list';
          this.modalHeader = 'Vending Machine';
          this.modalList = [
            '42 - Nutty Buddy Crunch',
            '29 - Choco Bliss Bars',
            '47 - Raisin Rocket Bars',
            '25 - Candy Comet Drops',
            '08 - Peanut Powerhouse',
            '02 - Trail Mix Triumph',
          ];
          this.showModal = true;
          break;
        case 'board':
          // Special confidential board message
          this.modalScreen = 'special';
          this.showSpecialMessage = true;
          this.showModal = true;
          break;
        case 'papers':
          this.modalScreen = 'clue';
          this.modalHeader = 'To:Vending Machine Supplier';
          this.modalBody =
            'TELL FRANK OR WHATEVER his name is to STOP filling the machine with such GOD awful snacks.' +
            " Sure some of them are AVERAGE at BEST but who wants BORING snacks with nuts or raisins? IN AN OFFICE!?!?!?!? It's boring enough here.";
          this.showModal = true;
          break;
        case 'calendar':
          // Open calendar modal with meeting data
          this.modalScreen = 'calendar';
          this.modalHeader = "Manager's Calendar";
          
          // Provide modalBody as a short instruction/prompt
          this.modalBody = 'Several meetings are scheduled this month.';
          
          // Meetings data used by the calendar modal
          this.modalList = [
            'Oct 3: Team Yoga',
            'Oct 10: Project Review',
            'Oct 16: Team Outing',
            'Oct 24: Project Review',
            'Oct 31: Team Check-in',
          ];
          this.showModal = true;
          break;
        default:
          // Fallback: open modal with filler text for any unhandled area
          this.modalScreen = 'default';
          this.modalHeader = area.title || 'Area';
          this.modalBody = area.description || 'Nothing special here yet.';          
          break;
      }
    }
  }

  getAreaText(): string {
    if (this.hoveredArea) {
      const area = GameArea.getArea(this.hoveredArea);
      if (area) {
        return area.description;
      }
    }
    return this.currentAreaText;
  }

  startGame(): void {
    this.onLandingPage = false;
    this.pageIndex = 0;
    this.dialog = this.textList[0]; // Show first text immediately
    this.showMonologue = true;
  }

  nextPage(): void {
    if (this.isExitDialogActive) {
      // Handle exit dialog advancement (single run only)
      if (this.pageIndex < this.exitTextList.length - 1) {
        // advance until the last exit line
        this.pageIndex++;
        this.dialog = this.exitTextList[this.pageIndex];
      } else {
        // Reached the end of exit dialog; do not advance further
        return;
      }
    } else {
      // Handle normal game dialog advancement
      if (this.pageIndex < this.textList.length - 1) {
        this.pageIndex++;
        this.dialog = this.textList[this.pageIndex];
      } else if (this.turnOffNextPage) {
        return;
      } else {
        this.dialog = '';
        this.showMonologue = false;
        this.currentRoom = 'base';
        this.turnOffNextPage = true;
      }
    }
  }

  investigateSpecificArea(location?: string) {
    this.currentRoom = location || 'base';
    this.currentAreaText = this.roomDescriptions[this.currentRoom];
  }

  attemptEscape() {
    // Move player to final door view where they can try to open the exit
    this.currentRoom = 'final_door';
    this.currentAreaText = 'You are at the final door. Try to open it.';
  }

  addDigit(digit: string): void {
    if (this.userInput.length < 6) {
      this.userInput += digit;
    }
  }

  removeLastDigit(): void {
    this.userInput = this.userInput.slice(0, -1);
  }

  submitPassword(): void {
    if (
      this.userInput.toLowerCase() === 'break room' ||
      this.userInput.toLowerCase() === 'breakroom'
    ) {
      this.modalHeader = 'Welcome Janitor';
      this.modalBody =
        'Cleaning schedule started. All the other doors in the building are now unlocked.';
      this.showInput = false;
      this.breakroomUnlocked = true;
      this.officeroomUnlocked = true;
      this.janitorComputerUnlocked = true;
    } else if (
      this.userInput.toLowerCase() === '271632' ||
      this.userInput.toLowerCase() === '27-16-32'
    ) {
      this.modalHeader = 'Escape Door Unlocked';
      this.modalBody =
        'You have entered the correct password. The door is now unlocked.';
      this.showInput = false;
      this.showModal = false;
      this.userInput = '';
      setTimeout(() => {
        this.gameOver();
      }, 500);
    } else {
      this.modalHeader = 'Incorrect password. Try again.';
      this.userInput = '';
    }
  }

  closeModal() {
    this.showModal = false;
    this.userInput = '';
    this.modalScreen = 'default';
    this.modalImage = undefined;
  }

  gameOver(): void {
    // Set game over state
    this.isGameOver = true;
    // Hide all game areas and show monologue on white background
    this.currentRoom = 'landing';
    this.onLandingPage = false;
    this.showMonologue = true;
    // Switch to exit dialog
    this.isExitDialogActive = true;
    // Reset dialog display
    this.pageIndex = 0;
    this.dialog = this.exitTextList[0];
    this.turnOffNextPage = false;
  }
}
