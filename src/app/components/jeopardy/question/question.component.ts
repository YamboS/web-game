import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JeopardyService } from '../jeopardy.service';

@Component({
  selector: 'app-jeopardy-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  categoryId = '';
  value = 0;
  questionText = '';
  categoryName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: JeopardyService
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['categoryId'];
    this.value = +this.route.snapshot.params['value'];
    this.svc.game$.subscribe((g) => {
      if (!g) return;
      const cat = g.categories.find((c) => c.id === this.categoryId);
      if (cat) {
        const q = cat.questions.find((qq) => qq.value === this.value);
        this.questionText = q?.question || '';
        this.categoryName = cat.name;
      }
    });
  }

  startTimer() {
    // Timer component handles timing; simply show it in template
  }

  revealAnswer() {
    this.router.navigate([`/jeopardy/answer/${this.categoryId}/${this.value}`]);
  }
}
