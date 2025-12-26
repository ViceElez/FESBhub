import type {PopupProperties} from "../constants";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {useState} from "react";
import {editSubjectComments,updateToken} from "../services";
import {useNavigate} from "react-router-dom";

export const UpdateSubjectCommentPopup = ({isOpen, onClose, id}: PopupProperties) => {
      
    const [content, setContent] = useState("");
    const [ratingPract, setRatingPract] = useState(0);
    const [ratingDiff, setRatingDiff] = useState(0);
    const [ratingExpect, setRatingExpect] = useState(0);
    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate()

    if(!isOpen) return null;

    const handleCommentUpdate=async ()=>{
        token = await updateToken(token!,login,logout,navigate,[onClose]);
        const response=await editSubjectComments(id,ratingPract,ratingDiff,ratingExpect,content,token,userId)
        if(response?.status===200)
            alert('Success')
        else {
            alert("Error")
            console.log(response)
        }
        onClose();
    }

    return (
        <div>
            <input type = "text" name = "content" placeholder = "Ovdje upišite novi komentar" onChange = {(e) => setContent(e.target.value)}/>
            <input type = "number" name = "ratingPract" placeholder = "Ovdje upišite novu ocjenu praktičnosti" onChange = {(e) => setRatingPract(Number(e.target.value))}/>
            <input type = "number" name = "ratingDiff" placeholder = "Ovdje upišite novu ocjenu težine" onChange = {(e) => setRatingDiff(Number(e.target.value))}/>
            <input type = "number" name = "ratingExpect" placeholder = "Ovdje upišite novu ocjenu očekivanja" onChange = {(e) => setRatingExpect(Number(e.target.value))}/>
            <button 
            disabled = {content.length === 0 || ratingPract < 1 || ratingPract > 5 || ratingDiff < 1 || ratingDiff > 5 || ratingExpect < 1 || ratingExpect > 5}
            onClick = {handleCommentUpdate}>
                Potvrdi
            </button>
        </div>
    )
}

