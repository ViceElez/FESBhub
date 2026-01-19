import type { Subject } from "./subjectType.ts";

export interface Professor {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  education: string;
  email: string;
  rating: number;
  professorImageUrl? : string;
  subjects?: Subject[];
}