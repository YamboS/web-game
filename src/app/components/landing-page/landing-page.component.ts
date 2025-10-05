import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
  ,
  animations: [
    trigger('fade', [    
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LandingPageComponent implements OnInit {
  
  onLandingPage = true;
  rotatedDialog = false;
  dialog:string = '';
  textList: string[] = [
    "You wake up in a dark room, the air thick with dust and the faint smell of mold. Your head throbs as you try to remember how you got here.",
    "As your eyes adjust to the dim light, you notice a door slightly ajar on the far side of the room. A sliver of light seeps through the crack, casting eerie shadows on the walls.",
    "You stand up, your legs shaky but determined. You approach the door cautiously, your heart pounding in your chest. Pushing it open, you step into a narrow hallway lined with old portraits whose eyes seem to follow your every move.",
    "At the end of the hallway, you find another door, this one locked tight. Frustration wells up inside you as you realize you're trapped. But then, you notice a small key hanging from a nail beside the door.",
    "With trembling hands, you take the key and unlock the door, stepping into a grand library filled with towering bookshelves and a roaring fireplace. A sense of relief washes over you as you realize you're not alone in this strange place.",
    "Suddenly, a shadowy figure emerges from the darkness, its eyes glowing with an otherworldly light. 'Welcome,' it says in a voice that sends chills down your spine. 'Your journey has just begun.'"
  ];
  
  ngOnInit(): void {}
  
  ngOnDestroy(): void {}
  
  constructor(private gameService: GameService) { }

startGame(): void {
  this.onLandingPage = false;
  console.log("Starting game...");
  
  let index = 0;
  this.dialog = this.textList[0]; // Show first text immediately
  
  const intervalId = setInterval(() => {
    index++;
    if (index < this.textList.length) {
      this.dialog = this.textList[index];
    } else {
      clearInterval(intervalId); // Stop when done
      this.dialog = "";
    }
  }, 3000);
  
  this.rotatedDialog = true;  
}  
}
