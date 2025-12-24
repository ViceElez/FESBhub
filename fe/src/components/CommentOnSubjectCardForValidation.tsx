import type { CommentSubject } from "../constants";
import {useState} from "react";
import { verifySubjectComment } from "../services/subjectCommentsApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken } from "../services/updateToken.ts";

export const CSCard = (comment: CommentSubject) => {
    const [verified, setVerified] = useState(comment.verified);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    if (verified === true) {
        return <div></div>;
    }

    const handleVerify = async () => {
        token = await updateToken(token!, login, logout, navigate, []);
        const response = await verifySubjectComment(comment.subjId, comment.userId, 
            comment.ratingPracticality,
            comment.ratingDifficulty,
            comment.ratingExpectation,
            comment.content, token);
        if (response?.status === 200) {
            setVerified(!verified);
            console.log("Comment verified successfully");
        }
    }

    return (
        <div style = {{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <div>
                <h2>Ocjena korisnosti: {comment.ratingPracticality}</h2>
                <h2>Ocjena težine: {comment.ratingDifficulty}</h2>
                <h2>Ocjena očekivanja: {comment.ratingExpectation}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
            <button 
            onClick = { handleVerify }>
                Verificiraj
            </button>
        </div>
    );
}