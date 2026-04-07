import type {CommentProfessor} from "./CommentProfessorType.ts";

export interface UpdateProfCommentPopup {
    isOpen: boolean
    onClose: () => void
    id: number
    onSuccess?: (updated: CommentProfessor) => void
}