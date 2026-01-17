import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {type UpdateProfCommentPopup} from "../constants";
import { useAuth } from "../hooks";
import { editProfessorComments, updateToken } from "../services";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "../index.css";

export const UpdateProfessorCommentPopup = ({isOpen, onClose, id,onSuccess}: UpdateProfCommentPopup) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);

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
            const updatedComment = {
                id: id,
                userId: Number(userId),
                profId: id,
                rating: rating,
                content,
                verified: true,
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

                <div className="subject-update-comment-modal-inputs">
                    <input
                        type="text"
                        placeholder="Novi komentar"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Nova ocjena profesora (1–5)"
                        value={rating || ""}
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
                            content.length === 0 ||
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
