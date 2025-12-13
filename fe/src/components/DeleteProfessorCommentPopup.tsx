import axios from "axios";
import type {PopupProperties} from "../constants";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {addProfessorComment, deleteProfessorComment, newAccessToken, tokenIsExpired} from "../services";
import {routes} from "../constants/routes.ts";
import {useNavigate} from "react-router-dom";

export const DeleteProfessorCommentPopup = ({isOpen, onClose, profId}: PopupProperties) => {

    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate()

    if(!isOpen) return null;

    const handleCommentDelete=async ()=>{
        const expired = token ? tokenIsExpired(token) : true;
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
        const response=await deleteProfessorComment(profId,token,userId)
        if(response?.status===200)
            alert('Success')

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


