import type { CommentSubject } from "../constants";
import {useState} from "react";
import { verifySubjectComment, deleteSubjectComment } from "../services/subjectCommentsApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken } from "../services/updateToken.ts";

export const CSCard = (comment: CommentSubject) => {
    const [verified, setVerified] = useState(comment.verified);
    const [deleted, setDeleted] = useState(false);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    if (verified === true || deleted === true) {
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

    const handleDelete = async () => {
            setDeleted(true);
            token = await updateToken(token!, login, logout, navigate, []);
            const response=await deleteSubjectComment(comment.subjId,token, comment.userId)
            if(response?.status===200){
                alert('Success')
            }
            else {
                alert("Error")
                console.log(response)
            }
        };

    return (
        <div className = "card-scroll-horizontally card" >
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
            <button
            onClick = {handleDelete}
            >
                Izbriši
            </button>
        </div>
    );
}

