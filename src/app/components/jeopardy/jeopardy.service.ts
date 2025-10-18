import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JeopardyGame, JeopardyCategory, Team } from './models/jeopardy-models';

@Injectable({ providedIn: 'root' })
export class JeopardyService {
  // Game data
  private _game$ = new BehaviorSubject<JeopardyGame | null>(null);
  game$ = this._game$.asObservable();

  // Teams
  private _teams$ = new BehaviorSubject<Team[]>([
    { id: 'team1', name: 'Team 1', score: 0 },
    { id: 'team2', name: 'Team 2', score: 0 },
  ]);
  teams$ = this._teams$.asObservable();

  // Track answered cells as a set of "categoryId-questionValue"
  private answered = new Set<string>();

  constructor() {}

  loadGame(game: JeopardyGame) {
    // ensure categories have ids and questions are in ascending order
    const normalized: JeopardyGame = {
      ...game,
      categories: (game.categories || []).map((c, idx) => ({
        id: c.id || `cat${idx + 1}`,
        name: c.name,
        questions: (c.questions || []).sort((a, b) => a.value - b.value),
      } as JeopardyCategory)),
    };
    this._game$.next(normalized);
    this.answered.clear();
  }

  markAnswered(categoryId: string, value: number) {
    this.answered.add(this.key(categoryId, value));
  }

  // Returns true when every question in the loaded game has been marked answered
  isAllAnswered(): boolean {
    const g = this._game$.getValue();
    if (!g) return false;
    const total = (g.categories || []).reduce((sum, c) => sum + (c.questions ? c.questions.length : 0), 0);
    return this.answered.size >= total && total > 0;
  }

  isAnswered(categoryId: string, value: number) {
    return this.answered.has(this.key(categoryId, value));
  }

  private key(categoryId: string, value: number) {
    return `${categoryId}-${value}`;
  }

  setTeamNames(names: { team1: string; team2: string }) {
    const current = this._teams$.getValue();
    current[0].name = names.team1 || current[0].name;
    current[1].name = names.team2 || current[1].name;
    this._teams$.next([...current]);
  }

  adjustScore(teamId: string, delta: number) {
    const teams = this._teams$.getValue().map((t) =>
      t.id === teamId ? { ...t, score: t.score + delta } : t
    );
    this._teams$.next(teams);
  }

  resetScores() {
    const teams = this._teams$.getValue().map((t) => ({ ...t, score: 0 }));
    this._teams$.next(teams);
  }
}
