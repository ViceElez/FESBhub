import axios from "axios";
import type {PopupProperties} from "../constants";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {useState} from "react";

export const UpdateProfessorCommentPopup = ({isOpen, onClose, profId}: PopupProperties) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const {token} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;

    if(!isOpen) <div></div>;

    return (
        <div>
            <input type = "text" name = "content" placeholder = "Ovdje upišite novi komentar" onChange = {(e) => setContent(e.target.value)}/>
            <input type = "number" name = "rating" placeholder = "Ovdje upišite novu ocjenu profesora" onChange = {(e) => setRating(Number(e.target.value))}/>
            <button 
            disabled = {content.length === 0 || rating < 1 || rating > 5}
            onClick = {() => {axios.patch('http://localhost:3000/comment-prof/', {
                data: {userId, profId, content, rating}, 
                headers: {Authorization: `Bearer ${token}`,}
        })
                onClose();  }}>
                Potvrdi
            </button>
        </div>
    )
}
