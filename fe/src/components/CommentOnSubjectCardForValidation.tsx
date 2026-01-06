import type { CommentSubject } from "../constants";
import { verifySubjectComment, deleteSubjectComment,updateToken } from "../services";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

type CommentSubjectCardAdminSettingsProps = {
    comment: CommentSubject;
    onRemove: (id: number) => void;
}
export const CommentSubjectCardAdminSettings = ({comment,onRemove}:CommentSubjectCardAdminSettingsProps) => {
    let { token, login, logout } = useAuth();
    const navigate = useNavigate();

    const handleVerify = async () => {
        token = await updateToken(token!, login, logout, navigate, []);
        const response = await verifySubjectComment(
            comment.subjId,
            comment.userId,
            comment.ratingPracticality,
            comment.ratingDifficulty,
            comment.ratingExpectation,
            comment.content,
            token
        );
        if (response?.status === 200) {
            alert("Successfully verified comment");
            onRemove(comment.id);
        }
        else{
            alert("Error verifying comment");
        }
    };

    const handleDelete = async () => {
        token = await updateToken(token!, login, logout, navigate, []);
        if(!confirm('Are you sure you want to delete this comment?')) {
            return;
        }
        const response = await deleteSubjectComment(comment.subjId, token, comment.userId);
        if (response?.status === 200) {
            alert("Successfully deleted comment");
            onRemove(comment.id);
        } else {
            alert("Error deleting comment");
        }
    };

    return (
        <div className="comment-card">
            <div className="comment-content">
                <h2>Subject ID: {comment.subjId}</h2>
                <h2>User ID: {comment.userId}</h2>
                <h3>Ocjena korisnosti: {comment.ratingPracticality.toFixed(2)}</h3>
                <h3>Ocjena težine: {comment.ratingDifficulty.toFixed(2)}</h3>
                <h3>Ocjena očekivanja: {comment.ratingExpectation.toFixed(2)}</h3>
                <p>Komentar: {comment.content}</p>
            </div>
            <div className="comment-actions">
                <button className="verify-btn" onClick={handleVerify}>Verify</button>
                <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};


