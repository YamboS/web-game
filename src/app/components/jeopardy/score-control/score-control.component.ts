import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-control',
  templateUrl: './score-control.component.html',
  styleUrls: ['./score-control.component.css'],
})
export class ScoreControlComponent {
  @Input() teamId = '';
}
