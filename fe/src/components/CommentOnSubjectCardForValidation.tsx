import type { CommentSubject } from "../constants";
import {useState} from "react";
import { verifySubjectComment, deleteSubjectComment,updateToken } from "../services";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export const CommentSubjectCardAdminSettings = (comment: CommentSubject) => {
    const [deleted, setDeleted] = useState(false);
    let { token, login, logout } = useAuth();
    const navigate = useNavigate();

    if (deleted) return <div></div>;

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
        }
    };

    const handleDelete = async () => {
        setDeleted(true);
        token = await updateToken(token!, login, logout, navigate, []);
        if(!confirm('Are you sure you want to delete this comment?')) {
            setDeleted(false);
            return;
        }
        const response = await deleteSubjectComment(comment.subjId, token, comment.userId);
        if (response?.status === 200) {
            setDeleted(true)
            alert("Successfully deleted comment");
        } else {
            setDeleted(false);
            alert("Error deleting comment");
        }
    };

    return (
        <div className="comment-card">
            <div className="comment-content">
                <h2>Subject ID: {comment.subjId}</h2>
                <h2>User ID: {comment.userId}</h2>
                <h3>Ocjena korisnosti: {comment.ratingPracticality}</h3>
                <h3>Ocjena težine: {comment.ratingDifficulty}</h3>
                <h3>Ocjena očekivanja: {comment.ratingExpectation}</h3>
                <p>Komentar: {comment.content}</p>
            </div>
            <div className="comment-actions">
                <button className="verify-btn" onClick={handleVerify}>Verify</button>
                <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};


