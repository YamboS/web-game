import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent {
  remaining = 30;
  interval: any = null;
  running = false;
  @Output() expired = new EventEmitter<void>();

  start() {
    if (this.running) return;
    this.running = true;
    this.remaining = 30;
    this.interval = setInterval(() => {
      this.remaining -= 1;
      if (this.remaining <= 0) {
        this.stop();
        this.expired.emit();
      }
    }, 1000);
  }

  stop() {
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  reset() {
    this.stop();
    this.remaining = 30;
  }
}
