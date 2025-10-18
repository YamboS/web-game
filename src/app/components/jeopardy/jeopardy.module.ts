import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SetupComponent } from './setup/setup.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { QuestionComponent } from './question/question.component';
import { AnswerComponent } from './answer/answer.component';
import { ScoreControlComponent } from './score-control/score-control.component';
import { TimerComponent } from './timer/timer.component';
import { FinalJeopardyComponent } from './final-jeopardy/final-jeopardy.component';

const routes: Routes = [
  { path: 'setup', component: SetupComponent },
  { path: 'board', component: GameBoardComponent },
  { path: 'question/:categoryId/:value', component: QuestionComponent },
  { path: 'answer/:categoryId/:value', component: AnswerComponent },
    { path: 'final', component: FinalJeopardyComponent },
  { path: '**', redirectTo: 'setup', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    SetupComponent,
    GameBoardComponent,
    QuestionComponent,
    AnswerComponent,
    ScoreControlComponent,
    TimerComponent,
      FinalJeopardyComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JeopardyModule {}
