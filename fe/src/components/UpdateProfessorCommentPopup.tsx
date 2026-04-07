import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import type { UpdateProfCommentPopup, CommentProfessor } from "../constants";
import { useAuth } from "../hooks";
import { editProfessorComments, updateToken } from "../services";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "../index.css";

type UpdateProfessorCommentPopupProps = UpdateProfCommentPopup & {
    comment?: CommentProfessor;
};

export const UpdateProfessorCommentPopup = ({isOpen, onClose, id, onSuccess, comment}: UpdateProfessorCommentPopupProps) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState<number>(0);

    let { token, login, logout } = useAuth();
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && comment) {
            setContent(comment.content);
            setRating(comment.rating);
        }
    }, [isOpen, comment]);

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

    const handleCommentUpdate = async () => {
        token = await updateToken(token!, login, logout, navigate, [onClose]);

        const response = await editProfessorComments(
            id,
            rating,
            content,
            token,
            userId
        );

        if (response?.status === 200) {
            alert("Updated successfully");

            const updatedComment: CommentProfessor = {
                ...comment!,
                rating,
                content,
            };

            onSuccess?.(updatedComment);
        } else {
            alert("Error");
            console.log(response);
        }

        onClose();
    };

    return createPortal(
        <div className="subject-update-comment-modal-overlay">
            <div className="subject-update-comment-modal">
                <h2 className="subject-update-comment-modal-title">
                    Izmijeni komentar
                </h2>

                {comment && (
                    <div className="update-comment-preview">
                        <p className="update-comment-preview__rating">
                            Trenutna ocjena:
                            <span className="update-comment-preview__stars">
                                {renderStars(comment.rating)}
                            </span>
                            <span className="update-comment-preview__number">
                                ({comment.rating.toFixed(2)})
                            </span>
                        </p>

                        <p className="update-comment-preview__content">
                            Trenutni komentar: {comment.content}
                        </p>
                    </div>
                )}

                <div className="subject-update-comment-modal-inputs">
                    <input
                        placeholder="Novi komentar"
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <input
                        type="number"
                        min={1}
                        max={5}
                        placeholder="Nova ocjena (1–5)"
                        onChange={(e) => setRating(Number(e.target.value))}
                    />
                </div>

                <div className="subject-update-comment-modal-actions">
                    <button
                        onClick={onClose}
                        className="subject-update-comment-modal-cancel-btn"
                    >
                        Odustani
                    </button>

                    <button
                        onClick={handleCommentUpdate}
                        disabled={
                            !content.trim() ||
                            rating < 1 ||
                            rating > 5
                        }
                        className="subject-update-comment-modal-confirm-btn"
                    >
                        Potvrdi
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
