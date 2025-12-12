import type { CommentProfessor } from "../constants";
import {useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import axios from "axios";

export const CPCard = (comment: CommentProfessor) => {
    const [verified, setVerified] = useState(comment.verified);

    if (verified === true) {
        return <div></div>;
    }

    const {token} = useAuth();


    return (
        <div style = {{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <div>
                <h2>Ocjena: {comment.rating}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
            <button 
            onClick = {() => {
                setVerified(!verified)
                axios.patch(`http://localhost:3000/comment-prof/verify`, {
                    professorId: comment.profId,
                    userId: comment.userId,
                    rating: comment.rating,
                    content: comment.content,
                }, {                    
                    headers: {
                    Authorization: `Bearer ${token}`
                }})
            }}>
                Verificiraj
            </button>
        </div>
    );
};

