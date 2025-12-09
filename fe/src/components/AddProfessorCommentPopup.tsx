import {useState} from "react";
import {useAuth} from "../hooks";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import type {PopupProperties} from "../constants";

export const AddProfessorCommentPopup = ({isOpen, onClose}: PopupProperties) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const {token}=useAuth() //userov token
    const decode = token ? jwtDecode(token) : null;
    //dekordiran token
    const userId=decode?.sub;// userov id, takode iz dekoriranog tokena mos izvuc kad istice(ali ta funckija je vec implelmentirana u auth.ts pa to pogledaj


    if (!isOpen) return null;

    return (
        <div>
            <input type = "text" name = "content" placeholder = "Ovdje upišite svoj komentar" onChange = {(e) => setContent(e.target.value)}/>
            <input type = "number" name = "rating" placeholder = "Ovdje upišite ocjenu profesora" onChange = {(e) => setRating(Number(e.target.value))}/>
            <button onClick = {() => {axios.post('http://localhost:3000/comment-prof', {content, rating,userId},{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            })
                onClose()}}>
                Potvrdi
            </button>
        </div>
    )
}