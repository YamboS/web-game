import { Component, OnInit } from '@angular/core';
import { JeopardyService } from '../jeopardy.service';
import { Router } from '@angular/router';
import { JeopardyGame, JeopardyCategory } from '../models/jeopardy-models';

@Component({
  selector: 'app-jeopardy-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  game: JeopardyGame | null = null;
  teams = [] as any;

  // make svc public so template can call helper methods like isAnswered
  constructor(public svc: JeopardyService, private router: Router) {}

  ngOnInit(): void {
    this.svc.game$.subscribe((g) => (this.game = g));
    this.svc.teams$.subscribe((t) => (this.teams = t));
  }

  cellClicked(cat: JeopardyCategory, q: any) {
    if (this.svc.isAnswered(cat.id, q.value)) return;
    this.router.navigate([`/jeopardy/question/${cat.id}/${q.value}`]);
  }

  markAnswered(catId: string, value: number) {
    this.svc.markAnswered(catId, value);
  }

  adjust(teamId: string, delta: number) {
    this.svc.adjustScore(teamId, delta);
  }

  goToFinal() {
    this.router.navigate(['/jeopardy/final']);
  }
}
