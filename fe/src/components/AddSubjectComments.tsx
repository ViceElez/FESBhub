import {useEffect, useState} from "react";
import {useAuth} from "../hooks";
import {jwtDecode} from "jwt-decode";
import type {PopupProperties} from "../constants";
import {addSubjectComment, updateToken} from "../services";
import {useNavigate} from "react-router-dom";
import {createPortal} from "react-dom";

export const AddSubjectComments = ({isOpen, onClose, id, onSuccess}: PopupProperties) => {

    const [content, setContent] = useState("");
    const [ratingPract, setRatingPract] = useState(0);
    const [ratingDiff, setRatingDiff] = useState(0);
    const [ratingExpect, setRatingExpect] = useState(0);
    let {token,logout,login} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate();


    useEffect(() => {
        if(isOpen){
            document.body.classList.add('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        }
    }, [isOpen]);

    if (!isOpen) return null;


    const handleCommentSubmit = async () => {
        const funcs = [onClose];
        token = await updateToken(token!, login, logout, navigate, funcs);
        const response = await addSubjectComment(id, ratingPract, ratingDiff, ratingExpect, content, token, userId)
        if(response?.status === 201){
            alert('Success')
            onSuccess?.();
            onClose();
        } else {
            alert("Error")
            console.log(response)
        }
    };

    return createPortal(
        <div className="subject-add-comment-modal-overlay">
            <div className="subject-add-comment-modal">
                <h2 className="subject-add-comment-modal-title">
                    Dodaj komentar
                </h2>

                <input
                    className="subject-add-comment-modal-input"
                    type="text"
                    placeholder="Ovdje upišite komentar"
                    onChange={(e) => setContent(e.target.value)}
                />

                <input
                    className="subject-add-comment-modal-input"
                    type="number"
                    placeholder="Ocjena praktičnosti (1–5)"
                    onChange={(e) => setRatingPract(Number(e.target.value))}
                />

                <input
                    className="subject-add-comment-modal-input"
                    type="number"
                    placeholder="Ocjena težine (1–5)"
                    onChange={(e) => setRatingDiff(Number(e.target.value))}
                />

                <input
                    className="subject-add-comment-modal-input"
                    type="number"
                    placeholder="Ocjena očekivanja (1–5)"
                    onChange={(e) => setRatingExpect(Number(e.target.value))}
                />

                <div className="subject-add-comment-modal-actions">
                    <button
                        className="subject-add-comment-modal-cancel-btn"
                        onClick={onClose}
                    >
                        Odustani
                    </button>

                    <button
                        className="subject-add-comment-modal-confirm-btn"
                        disabled={
                            content.length === 0 ||
                            ratingPract < 1 || ratingPract > 5 ||
                            ratingDiff < 1 || ratingDiff > 5 ||
                            ratingExpect < 1 || ratingExpect > 5
                        }
                        onClick={handleCommentSubmit}
                    >
                        Potvrdi
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
