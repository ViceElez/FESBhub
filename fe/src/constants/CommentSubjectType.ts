export interface CommentSubject {
  id: number;
  subjId: number;
  userId: number;
  content: string;
  ratingExpectation: number;
  ratingDifficulty: number;
  ratingPracticality: number;
  verified: boolean;
}