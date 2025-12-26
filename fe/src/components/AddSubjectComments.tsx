import {useState} from "react";
import {useAuth} from "../hooks";
import {jwtDecode} from "jwt-decode";
import type {PopupProperties} from "../constants";
import {addSubjectComment} from "../services";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../services/updateToken.ts";

export const AddSubjectComments = ({isOpen, onClose, id, onSuccess}: PopupProperties) => {
    
    const [content, setContent] = useState("");
    const [ratingPract, setRatingPract] = useState(0);
    const [ratingDiff, setRatingDiff] = useState(0);
    const [ratingExpect, setRatingExpect] = useState(0);
    let {token,logout,login} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate();

    if ((!isOpen))
        return <div></div>;

    const handleCommentSubmit =async () => {
        const funcs = [onClose];
        token = await updateToken(token!,login,logout,navigate,funcs);
        const response=await addSubjectComment(id,ratingPract,ratingDiff,ratingExpect,content,token,userId)
        if(response?.status===201){
            alert('Success')
            onSuccess?.();
            onClose();
        }
        else {
            alert("Error")
            console.log(response)
        }
        onClose();
    };

    return (
        <div>
            <input type = "text" name = "content" placeholder = "Ovdje upišite prvi komentar" onChange = {(e) => setContent(e.target.value)}/>
            <input type = "number" name = "ratingPract" placeholder = "Ovdje upišite ocjenu praktičnosti predmeta" onChange = {(e) => setRatingPract(Number(e.target.value))}/>
            <input type = "number" name = "ratingDiff" placeholder = "Ovdje upišite ocjenu težine predmeta" onChange = {(e) => setRatingDiff(Number(e.target.value))}/>
            <input type = "number" name = "ratingExpect" placeholder = "Ovdje upišite ocjenu očekivanja predmeta" onChange = {(e) => setRatingExpect(Number(e.target.value))}/>
            <button
            disabled = {
                content.length === 0 || 
                ratingPract < 1 || ratingPract > 5 || 
                ratingDiff < 1 || ratingDiff > 5 || 
                ratingExpect < 1 || ratingExpect > 5
            }
            onClick = {handleCommentSubmit}>
                Potvrdi
            </button>
        </div>
    )
}

