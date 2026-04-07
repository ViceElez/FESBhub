import { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import { jwtDecode } from "jwt-decode";
import type { PopupProperties } from "../constants";
import {
    addProfessorComment,
    getUserById,
    verifyProfessorComment,
    updateToken
} from "../services";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

export const AddProfessorCommentPopup = ({isOpen, onClose,id, onSuccess}: PopupProperties) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);

    let { token, logout, login } = useAuth();
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

    const handleCommentSubmit = async () => {
        const funcs = [onClose];
        token = await updateToken(token!, login, logout, navigate, funcs);

        const user = await getUserById(+userId!, token!);
        if (user?.request.status === 200) {
            const response = await addProfessorComment(
                id,
                rating,
                content,
                token,
                userId
            );

            if (response?.status === 201) {
                alert("Success");
                onSuccess?.();
                onClose();

                if (user.data.isVerified === true) {
                    const verifyResponse = await verifyProfessorComment(
                        id,
                        +userId!,
                        rating,
                        content,
                        token
                    );
                    if (verifyResponse?.status !== 200) {
                        alert("Error verifying comment.");
                    }
                }
            } else {
                alert("Error");
                console.log(response);
            }
        } else {
            alert("Error fetching user data.");
        }
    };

    return createPortal(
        <div className="subject-add-comment-modal-overlay">
            <div className="subject-add-comment-modal">
                <h2 className="subject-add-comment-modal-title">
                    Dodaj komentar o profesoru
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
                    placeholder="Ocjena profesora (1–5)"
                    onChange={(e) => setRating(Number(e.target.value))}
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
                            rating < 1 ||
                            rating > 5
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
};
