import type { CommentProfessor } from "../constants";
import {useState} from "react";
import {useAuth} from "../hooks";
import {updateToken} from "../services/updateToken.ts";
import {verifyProfessorComment} from "../services/professorCommentsApi.ts";
import {useNavigate} from "react-router-dom";

export const CPCard = (comment: CommentProfessor) => {
    const [verified, setVerified] = useState(comment.verified);

    if (verified === true) {
        return <div></div>;
    }

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();


    return (
        <div style = {{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <div>
                <h2>Ocjena: {comment.rating}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
            <button 
            onClick = {async () => {
                setVerified(!verified)
                verifyProfessorComment(comment.profId, comment.userId, comment.rating, comment.content, await updateToken(token!, login, logout, navigate, []));
            }}>
                Verificiraj
            </button>
        </div>
    );
};

