import type { CommentSubject } from "../constants";
import {useState} from "react";
import { verifySubjectComment, deleteSubjectComment,updateToken } from "../services";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export const CommentSubjectCardAdminSettings = (comment: CommentSubject) => {
    const [verified, setVerified] = useState(comment.verified);
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
            setVerified(true);
        }
    };

    const handleUnverify = async () => {
        console.log("Unverify not implemented yet");
    };

    const handleDelete = async () => {
        setDeleted(true);
        token = await updateToken(token!, login, logout, navigate, []);
        const response = await deleteSubjectComment(comment.subjId, token, comment.userId);
        if (response?.status === 200) {
            alert("Success");
        } else {
            alert("Error");
            console.log(response);
        }
    };

    return (
        <div className="admin-card">
            <div className="admin-card-content">
                <h2>Ocjena korisnosti: {comment.ratingPracticality}</h2>
                <h2>Ocjena težine: {comment.ratingDifficulty}</h2>
                <h2>Ocjena očekivanja: {comment.ratingExpectation}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
            <div className="admin-card-actions">
                {!verified && <button className="verify-btn" onClick={handleVerify}>Verify</button>}
                {verified && <button className="unverify-btn" onClick={handleUnverify}>Unverify</button>}
                <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};


