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
    'You are an employee at Ford',
    'Your manager, Fim Jarley, has locked you in the office ' +
    'because the vehicle launch was a complete disaster',
    "and you're not leaving till it's fixed",
    'but you have other plans',
    "It's time to escape!",
  ];

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
  showSpecialMessage=false;
  turnOffNextPage: boolean = false;
  modalList: string[] = []    

  private roomDescriptions: Record<string, string> = {
    base: "You're in the main office area.",
    manager_office: "You're in the manager's office. Look around for clues.",
    dining_room: "You're in the break room. Look around for clues.",
    janitor_closet: "You're in the janitor's closet. Look around for clues."
  };

  // Listen for Enter key to progress dialogue

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    if (!this.onLandingPage) {
      this.nextPage();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor() {}

  hoveredArea: string | null = null;

  onAreaClick(areaId: string, event: Event) {
  event.preventDefault();

  const area = GameArea.getArea(areaId);      
  this.showSpecialMessage=false;
  this.showInput = false;  
  if (area) {
    // Use a switch on the areaId so behavior is stable even if titles change
    switch (areaId) {
      case 'computer':
        // In the janitor closet the computer prompts for a password        
        this.modalScreen = 'password';
        this.modalHeader = 'Computer Password Required';
        this.modalBody = 'The computer is asking for an encoded password, the hint says my favorite place in the office.';
        this.showModal = true;
        this.showInput = true;    
        break;
      case 'vending_machine':
        this.modalScreen = 'list';
        this.modalHeader = 'Vending Machine';
        this.modalList = ['42 - Nutty Buddy Crunch', '12 - Choco Bliss Bars', '47 - Raisin Rocket Bars', '45 - Caramel Craze Cubes', '23 - Candy Comet Drops', '51 - Peanut Powerhouse', '56 - Fruity Fizz Strips', '63 - Trail Mix Triumph'];
        this.showModal = true;
        break;
      case 'lunch_table':
        this.modalScreen = 'default';
        this.modalHeader = 'Somebody left the lunch table a mess!';
        this.modalBody = '';
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
        this.modalBody = "Tell Frank or whatever his name is to stop filling the machine with such god awful snacks." 
        + " Sure some of them are good but who wants boring snacks with nuts or raisins? In an office!?!?!?!? It's boring enough here.";
        this.showModal = true;
        break;
      default:
        // Fallback: open modal with filler text for any unhandled area
        this.modalScreen = 'default';
        this.modalHeader = area.title || 'Area';
        this.modalBody = area.description || 'Nothing special here yet.';
        this.showModal = true;
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

  investigateSpecificArea(location?: string) {
    this.currentRoom = location || 'base';
    this.currentAreaText = this.roomDescriptions[this.currentRoom];
  }

  attemptEscape() {
    // Move player to final door view where they can try to open the exit
    this.currentRoom = 'final_door';
    this.currentAreaText = 'You are at the final door. Try to open it.';
  }
  
  submitPassword(): void {
    if (this.userInput.toLowerCase() === 'break room') {            
      this.modalHeader = "Welcome Janitor";
      this.modalBody =
      "Cleaning schedule started. All the other doors in the building are now unlocked.";
      this.showInput = false;

      this.breakroomUnlocked = true;
      this.officeroomUnlocked = true;
    } else {
      this.modalHeader = 'Incorrect password. Try again.';
    }
  }

  closeModal(){
    this.showModal = false;
    this.userInput = '';
    this.modalScreen = 'default';
    this.modalImage = undefined;
  }
}
