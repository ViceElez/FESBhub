import type {PopupProperties} from "../constants";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {deleteProfessorComment} from "../services";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../services/updateToken.ts";

export const DeleteProfessorCommentPopup = ({isOpen, onClose, profId,onSuccess}: PopupProperties) => {

    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate()

    if(!isOpen) return null;

    const handleCommentDelete=async ()=>{
        token = await updateToken(token!,login,logout,navigate,[onClose]);
        const response=await deleteProfessorComment(profId,token,userId)
        if(response?.status===200){
            alert('Success')
            onSuccess?.();
            onClose()
        }

        else {
            alert("Error")
            console.log(response)
        }
        onClose()
    }

    return (
        <div>
            <button onClick = {handleCommentDelete}>
                Potvrdi
            </button>
        </div>
    )
}


