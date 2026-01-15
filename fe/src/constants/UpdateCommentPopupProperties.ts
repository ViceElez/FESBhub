import { type CommentSubject } from "../constants"
export interface UpdateCommentPopupProperties {
    isOpen: boolean
    onClose: () => void
    id: number
    onSuccess?: (updated: CommentSubject) => void

}