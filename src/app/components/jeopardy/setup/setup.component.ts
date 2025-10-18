import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JeopardyService } from '../jeopardy.service';

@Component({
  selector: 'app-jeopardy-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
})
export class SetupComponent {
  team1 = '';
  team2 = '';

  constructor(private svc: JeopardyService, private router: Router) {}

  startGame() {
    this.svc.setTeamNames({ team1: this.team1 || 'Team 1', team2: this.team2 || 'Team 2' });
    // Load template from assets (recommended path). If fetch fails, try the component-local copy or fallback.
    fetch('assets/jeopardy/game-data.template.json')
      .then((r) => r.json())
      .then((data) => {
        this.svc.loadGame(data);
        this.router.navigate(['/jeopardy/board']);
      })
      .catch(() => {
        // inline minimal fallback if the asset fetch fails
        const fallback = { gameTitle: 'Fallback Game', categories: [] } as any;
        this.svc.loadGame(fallback);
        this.router.navigate(['/jeopardy/board']);
      });
  }
}
