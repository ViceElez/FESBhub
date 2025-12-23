import type {PopupProperties} from "../constants";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {deleteSubjectComment} from "../services";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../services/updateToken.ts";

export const DeleteSubjectCommentPopup = ({isOpen, onClose, id,onSuccess}: PopupProperties) => {

    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate();

    if(!isOpen) return <div></div>;

    const handleCommentDelete=async ()=>{
        token = await updateToken(token!,login,logout,navigate,[onClose]);
        const response=await deleteSubjectComment(id,token,userId)
        if(response?.status===200){
            alert('Success')
            onSuccess?.();
            onClose()
        }
        else {
            alert("Error")
            console.log(response)
        }
        onClose();
    };

    return (
        <div>
            <button onClick = {handleCommentDelete}>
                Potvrdi
            </button>
        </div>
    )
}