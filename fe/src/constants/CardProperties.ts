import type {Professor} from "./professorType";

export interface CardProperties {
    prof: Professor;
    profId: number;
    showDetails?: boolean;
}
