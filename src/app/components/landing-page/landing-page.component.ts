import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { GameArea } from 'src/app/models/game-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    'Corporate villain Barry Mara, has locked you in the office ' +
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
  modalHeader = '';
  modalBody = '';
  userInput: string = '';

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

  constructor(private gameService: GameService) {}

  hoveredArea: string | null = null;

  onAreaClick(areaId: string, event: Event) {
  event.preventDefault();

  const area = GameArea.getArea(areaId);      
  if (area) {            
    if (this.currentRoom === 'janitor_closet') {
      this.modalHeader = 'Computer Password Required';
      this.modalBody ='The computer is asking for a password, the hint says my favorite place in the office.';
      this.showModal = true;
      this.showInput = true;
    }
    else if (area?.title === 'Vending Machine'){
      this.showInput = false;
      this.modalHeader = 'Vending Machine';
      this.modalBody = "The vending machine is full of snacks!";
      this.showModal = true;
    }
    else if (area?.title === 'Lunch Table'){
      this.showInput = false;
      this.modalHeader = 'Somebody left the lunch table a mess';
      this.modalBody = "The vending machine is full of snacks!";
      this.showModal = true;
    }
    else if (area?.title === 'Meeting Board'){
      this.showInput = false;
      this.modalHeader = "Confidential: How to Unlock the door";
      this.modalBody = "The door requires a 6 alphanumeric digits code to unlock. The first two can be found in the break room, the next in the"
      +" the second two are in my office, and the last one is in the Janitor's closet if I ever forget since there is no resetting the code, Good Luck Me!";
      this.showModal = true;
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
    } else if (this.showModal) {
      return;
    } else {
      this.dialog = '';
      this.showMonologue = false;
      this.currentRoom = 'base';
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 5000); // Show alert after 5 seconds
    }
  }

  investigateSpecificArea(location?: string) {
    this.currentRoom = location || 'base';
    this.currentAreaText = this.roomDescriptions[this.currentRoom];
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
  }
}
