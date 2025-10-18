import { Component, OnInit } from '@angular/core';
import { JeopardyService } from '../jeopardy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-final-jeopardy',
  template: "<div class='final-screen'>\n  <div class='final-inner'>\n    <h2 class='mb-3'>Final Jeopardy</h2>\n    <div class='question-box mb-4'>{{ finalQuestion }}</div>\n    <div class='wagers mb-4 row'>\n      <div class='col-md-6' *ngFor='let team of teams'>\n        <div class='card p-3 mb-2'>\n          <div class='fw-bold'>{{ team.name }} (Score: ${{ team.score }})</div>\n          <div class='mt-2'>\n            <label>Wager</label>\n            <input type='number' class='form-control' [(ngModel)]='wagers[team.id]' />\n          </div>\n          <div class='mt-2'>\n            <button class='btn btn-success me-2' (click)='applyResult(team.id, true)' [disabled]='!answerRevealed'>Mark Correct</button>\n            <button class='btn btn-danger' (click)='applyResult(team.id, false)' [disabled]='!answerRevealed'>Mark Incorrect</button>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class='mb-3'>\n      <button class='btn btn-primary me-2' (click)='reveal()'>Reveal Answer</button>\n      <button class='btn btn-secondary' (click)='returnToBoard()'>Return to Board</button>\n    </div>\n    <div *ngIf='answerRevealed' class='answer-box mt-3 p-3'>{{ finalAnswer }}</div>\n  </div>\n</div>",
  styles: [".final-screen{ background:#0b2d88; min-height:100vh; color:#fff; display:flex; align-items:center; justify-content:center; padding:20px } .final-inner{ max-width:1100px; width:100% } .final-inner .question-box{ font-family: Georgia, serif; font-size:1.8rem; text-transform:uppercase; text-align:center; padding:18px; background:rgba(255,255,255,0.06); border-radius:6px } .final-inner .answer-box{ font-family: Georgia, serif; font-size:1.6rem; text-align:center; background:rgba(255,255,255,0.08); border-radius:6px } .card{ background: rgba(255,255,255,0.06); }"],
})
export class FinalJeopardyComponent implements OnInit {
  teams: any[] = [];
  wagers: { [teamId: string]: number } = {};
  finalQuestion = 'Final Jeopardy placeholder question. Replace with your own wording.';
  finalAnswer = 'Final Jeopardy placeholder answer.';
  answerRevealed = false;

  constructor(private svc: JeopardyService, private router: Router) {}

  ngOnInit(): void {
    this.svc.teams$.subscribe((t) => {
      this.teams = t;
      this.teams.forEach((team) => {
        if (this.wagers[team.id] === undefined) this.wagers[team.id] = Math.max(0, team.score);
      });
    });

    this.svc.game$.subscribe((g) => {
      if (!g) return;
      if ((g as any).finalJeopardy) {
        this.finalQuestion = (g as any).finalJeopardy.question || this.finalQuestion;
        this.finalAnswer = (g as any).finalJeopardy.answer || this.finalAnswer;
      }
    });
  }

  reveal() {
    this.answerRevealed = true;
  }

  applyResult(teamId: string, correct: boolean) {
    const wager = Number(this.wagers[teamId]) || 0;
    this.svc.adjustScore(teamId, correct ? wager : -wager);
  }

  returnToBoard() {
    this.router.navigate(['/jeopardy/board']);
  }
}
