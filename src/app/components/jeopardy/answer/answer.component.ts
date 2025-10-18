import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JeopardyService } from '../jeopardy.service';

@Component({
  selector: 'app-jeopardy-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
})
export class AnswerComponent implements OnInit {
  categoryId = '';
  value = 0;
  answerText = '';
  categoryName = '';

  constructor(private route: ActivatedRoute, private svc: JeopardyService, private router: Router) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['categoryId'];
    this.value = +this.route.snapshot.params['value'];

    this.svc.game$.subscribe((g) => {
      if (!g) return;
      const cat = g.categories.find((c) => c.id === this.categoryId);
      if (cat) {
        const q = cat.questions.find((qq) => qq.value === this.value);
        this.answerText = q?.answer || '';
        this.categoryName = cat.name;
      }
    });
  }

  returnToBoard() {
    this.svc.markAnswered(this.categoryId, this.value);
    this.router.navigate(['/jeopardy/board']);
  }
}
