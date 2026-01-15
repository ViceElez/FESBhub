import type {PopupProperties} from "../constants";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {deleteProfessorComment,updateToken} from "../services";
import {useNavigate} from "react-router-dom";

export const DeleteProfessorCommentPopup = ({isOpen, onClose, id,onSuccess}: PopupProperties) => {

    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate()

    if(!isOpen) return <div></div>;

    const handleCommentDelete=async ()=>{
        token = await updateToken(token!,login,logout,navigate,[onClose]);
        const response=await deleteProfessorComment(id,token, userId === undefined ? 0 : +userId)
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


