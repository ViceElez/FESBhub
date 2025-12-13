import type {PopupProperties} from "../constants";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {useState} from "react";
import {editProfessorComments, newAccessToken, tokenIsExpired} from "../services";
import {useNavigate} from "react-router-dom";
import {routes} from "../constants/routes.ts"

export const UpdateProfessorCommentPopup = ({isOpen, onClose, profId}: PopupProperties) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate()

    if(!isOpen) return null;

    const handleCommentUpdate=async ()=>{
        const expired=token?tokenIsExpired(token):true;
        if(expired){
            const newAccessTokenResponse=await newAccessToken()
            if(newAccessTokenResponse?.status!==201){
                alert('Please login again')
                logout()
                onClose()
                navigate(routes.LOGIN)
            }
            else{
                login(newAccessTokenResponse.data)
                token=newAccessTokenResponse.data
            }
        }
        const response=await editProfessorComments(profId,rating,content,token,userId)
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
            <input type = "number" name = "rating" placeholder = "Ovdje upišite novu ocjenu profesora" onChange = {(e) => setRating(Number(e.target.value))}/>
            <button 
            disabled = {content.length === 0 || rating < 1 || rating > 5}
            onClick = {handleCommentUpdate}>
                Potvrdi
            </button>
        </div>
    )
}
//fix delete nesto, i fixat kad se botun za dodoat kometar za profa stisne(vjerojanto ista stvar s acces tokenon)


