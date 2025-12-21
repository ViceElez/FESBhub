import type { CommentProfessor } from "../constants";
import {useState} from "react";
import { verifyProfessorComment } from "../services/professorCommentsApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken } from "../services/updateToken.ts";


export const CPCard = (comment: CommentProfessor) => {
    const [verified, setVerified] = useState(comment.verified);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    if (verified === true) {
        return <div></div>;
    }

    const handleVerify = async () => {
        token = await updateToken(token!, login, logout, navigate, []);
        const response = await verifyProfessorComment(comment.profId, comment.userId, comment.rating, comment.content, token);
        if (response?.status === 200) {
            //nemoze se vise prikazivat samo
            setVerified(!verified);
            console.log("Comment verified successfully");
        }
    }


    return (
        <div style = {{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <div>
                <h2>Ocjena: {comment.rating}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
            <button 
            onClick = { handleVerify }>
                Verificiraj
            </button>
        </div>
    );
};

