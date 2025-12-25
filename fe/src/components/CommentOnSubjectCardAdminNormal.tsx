import type { CommentSubject } from "../constants";
import {useState} from "react";
import { deleteSubjectComment } from "../services/subjectCommentsApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken } from "../services/updateToken.ts";

export const CSCardAdminNormal = (comment: CommentSubject) => {
    const [deleted, setDeleted] = useState(false);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    if (deleted === true) {
        return <div></div>;
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
        <div style = {{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <div>
                <h2>Ocjena korisnosti: {comment.ratingPracticality}</h2>
                <h2>Ocjena težine: {comment.ratingDifficulty}</h2>
                <h2>Ocjena očekivanja: {comment.ratingExpectation}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
            <button
            onClick = {handleDelete}
            >
                Izbriši
            </button>
        </div>
    );
}