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


    if (!isOpen)
        return <div></div>;

    return (
        <div>
            <input type = "text" name = "content" placeholder = "Ovdje upišite svoj komentar" onChange = {(e) => setContent(e.target.value)}/>
            <input type = "number" name = "rating" placeholder = "Ovdje upišite ocjenu profesora" onChange = {(e) => setRating(Number(e.target.value))}/>
            <button
            disabled = {content.length === 0 || rating < 1 || rating > 5}
            onClick = {() => {axios.post('http://localhost:3000/comment-prof', {
                data: {userId, profId, rating, content}, 
                headers: {Authorization: `Bearer ${token}`,}
        })
                onClose()}}>
                Potvrdi
            </button>
        </div>
    )
}


