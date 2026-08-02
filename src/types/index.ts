export interface Choice {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  label: string;
  choices: Choice[];
}

export interface CurrentQuizResponse {
  quizId: string;
  reward: string;
  question: QuizQuestion;
  store: {
    name: string;
    googleReviewUrl: string;
  };
}

export interface StatsResponse {
  scans: number;
  participations: number;
  correctAnswers: number;
  conversionRate: number; // participations / scans
  googleClicks: number;
  averageRating: number;
}

export interface ParticipationRow {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  cardNumber: string;
  selectedChoiceId: string;
  isCorrect: boolean;
  rating: number;
  redirectedToGoogle: boolean;
  isWinner: boolean;
  createdAt: string;
}
