export interface Professor {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  education: string;
  email: string;
  rating: number;
  imageUrl? : string;
  subjects?: string[];
}