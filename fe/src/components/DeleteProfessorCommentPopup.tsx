import axios from "axios";
import type {PopupProperties} from "../constants";

export const DeleteProfessorCommentPopup = ({isOpen, onClose, id}: PopupProperties & {id: number}) => {

    if(!isOpen) return null;

    return (
        <div>
            <button onClick = {() => {axios.delete(`http://localhost:3000/prof/${id}`)
                onClose();  }}>
                Potvrdi
            </button>
        </div>
    )
}