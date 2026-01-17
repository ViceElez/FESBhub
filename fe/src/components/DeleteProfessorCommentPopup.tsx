import { useEffect } from "react";
import type { PopupProperties } from "../constants";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks";
import { deleteProfessorComment, updateToken } from "../services";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "../index.css";

export const DeleteProfessorCommentPopup = ({isOpen, onClose, id, onSuccess}: PopupProperties) => {
    let { token, login, logout } = useAuth();
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("modal-open");
        }
        return () => {
            document.body.classList.remove("modal-open");
        };
    }, [isOpen]);

    useEffect(() => {
        if(!isOpen) return;
        const fetchComment=async()=>{
            token = await updateToken(token!, login, logout, navigate, []);
            // Additional fetching logic can be added here if needed
        }
    }, [isOpen,id,userId]);

    if (!isOpen) return null;

    const handleCommentDelete = async () => {
        token = await updateToken(token!, login, logout, navigate, [onClose]);

        const response = await deleteProfessorComment(
            id,
            token,
            userId === undefined ? 0 : +userId
        );

        if (response?.status === 200) {
            alert("Deleted successfully");
            onSuccess?.();
        } else {
            alert("Error");
            console.log(response);
        }
        onClose();
    };

    return createPortal(
        <div className="subject-delete-comment-modal-overlay">
            <div className="subject-delete-comment-modal">
                <h3 className="subject-delete-comment-modal-title">
                    Jeste li sigurni da želite izbrisati komentar?
                </h3>

                <div className="subject-delete-comment-modal-content">
                    <p>Ova radnja je nepovratna.</p>
                </div>

                <div className="subject-delete-comment-modal-actions">
                    <button
                        onClick={onClose}
                        className="subject-delete-comment-modal-cancel-btn"
                    >
                        Odustani
                    </button>

                    <button
                        onClick={handleCommentDelete}
                        className="subject-delete-comment-modal-confirm-btn"
                    >
                        Potvrdi
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
