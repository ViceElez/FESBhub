import {useState} from "react";
import {useAuth} from "../hooks";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import type {PopupProperties} from "../constants";

export const AddProfessorCommentPopup = ({isOpen, onClose, profId}: PopupProperties) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const {token} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;

    if ((!isOpen))
        return null;

    return (
        <div>
            <input type = "text" name = "content" placeholder = "Ovdje upišite prvi komentar" onChange = {(e) => setContent(e.target.value)}/>
            <input type = "number" name = "rating" placeholder = "Ovdje upišite prvu ocjenu profesora" onChange = {(e) => setRating(Number(e.target.value))}/>
            <button
            disabled = {content.length === 0 || rating < 1 || rating > 5}
            onClick = {() => {console.log(userId, profId, content, rating);
                axios.post('http://localhost:3000/comment-prof', {
                    "userId": userId, 
                    "professorId": profId, 
                    "rating": rating, 
                    "content": content
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                onClose()
                }}>
                Potvrdi
            </button>
        </div>
    )
}


