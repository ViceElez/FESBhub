import axios from "axios";
import type {PopupProperties} from "../constants";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";

export const DeleteProfessorCommentPopup = ({isOpen, onClose, profId}: PopupProperties) => {

    const {token} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;

    if(!isOpen) return <div></div>;

    return (
        <div>
            <button onClick = {() => {axios.delete('http://localhost:3000/comment-prof/', {
                data: {userId, profId}, 
                headers: {Authorization: `Bearer ${token}`,}
        })
                onClose();  }}>
                Potvrdi
            </button>
        </div>
    )
}
