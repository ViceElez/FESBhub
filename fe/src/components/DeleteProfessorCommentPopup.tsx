import { useEffect } from "react";
import type { PopupProperties, CommentProfessor } from "../constants";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks";
import { deleteProfessorComment, updateToken } from "../services";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "../index.css";

type DeleteProfessorCommentPopupProps = PopupProperties & {
    comment?: CommentProfessor;
};

export const DeleteProfessorCommentPopup = ({isOpen, onClose, id, onSuccess, comment}: DeleteProfessorCommentPopupProps) => {
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

    if (!isOpen) return null;

    const renderStars = (rating: number) => {
        const full = Math.round(rating);
        return (
            <>
                {"★".repeat(full)}
                {"☆".repeat(5 - full)}
            </>
        );
    };

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

                    {comment && (
                        <div className="delete-comment-preview">
                            <p className="delete-comment-preview__rating">
                                Ocjena:
                                <span className="delete-comment-preview__stars">
                                    {renderStars(comment.rating)}
                                </span>
                                <span className="delete-comment-preview__number">
                                    ({comment.rating.toFixed(2)})
                                </span>
                            </p>

                            <p className="delete-comment-preview__content">
                                Komentar: {comment.content}
                            </p>
                        </div>
                    )}
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
