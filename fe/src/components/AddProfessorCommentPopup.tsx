import {useState} from "react";
import {useAuth} from "../hooks";
import {jwtDecode} from "jwt-decode";
import type {PopupProperties} from "../constants";
import {addProfessorComment} from "../services";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../services/updateToken.ts";

export const AddProfessorCommentPopup = ({isOpen, onClose, profId,onSuccess}: PopupProperties) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    let {token,logout,login} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate();

    if ((!isOpen))
        return null;

    const handleCommentSubmit =async () => {
        const funcs = [onClose];
        token = await updateToken(token!,login,logout,navigate,funcs);
        const response=await addProfessorComment(profId,rating,content,token,userId)
        if(response?.status===201){
            alert('Success')
            onSuccess?.();
            onClose();
        }
        else {
            alert("Error")
            console.log(response)
        }
        onClose()
    }

    return (
        <div>
            <input type = "text" name = "content" placeholder = "Ovdje upišite prvi komentar" onChange = {(e) => setContent(e.target.value)}/>
            <input type = "number" name = "rating" placeholder = "Ovdje upišite prvu ocjenu profesora" onChange = {(e) => setRating(Number(e.target.value))}/>
            <button
            disabled = {content.length === 0 || rating < 1 || rating > 5}
            onClick = {handleCommentSubmit}>
                Potvrdi
            </button>
        </div>
    )
}


