export interface JeopardyQuestion {
  value: number;
  question: string;
  answer: string;
  answered?: boolean;
}

export interface JeopardyCategory {
  id: string;
  name: string;
  questions: JeopardyQuestion[];
}

export interface JeopardyGame {
  gameTitle: string;
  categories: JeopardyCategory[]; // exactly 6 categories
}

export interface Team {
  id: string;
  name: string;
  score: number;
}
