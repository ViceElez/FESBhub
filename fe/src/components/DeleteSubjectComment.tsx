import { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { deleteSubjectComment, getSubjectCommentBySubjectAndUserId, updateToken } from "../services";
import type { PopupProperties } from "../constants";
import { createPortal } from "react-dom";
import '../index.css'

export const DeleteSubjectCommentPopup = ({ isOpen, onClose, id, onSuccess }: PopupProperties) => {
    const [comment, setComment] = useState<any>();
    let { token, login, logout } = useAuth();
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;
        const fetchComment = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res = await getSubjectCommentBySubjectAndUserId(id, userId, token);
            if (res?.status === 200) setComment(res.data);
            else console.log("Error fetching comment", res);
        };
        void fetchComment();
    }, [isOpen]);

    const handleCommentDelete = async () => {
        token = await updateToken(token!, login, logout, navigate, [onClose]);
        const response = await deleteSubjectComment(id, token, Number(userId));
        if (response?.status === 200) {
            alert("Deleted successfully");
            onSuccess?.(id);
        } else console.log("Error", response);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="subject-delete-comment-modal-overlay">
            <div className="subject-delete-comment-modal">
                <h3 className="subject-delete-comment-modal-title">
                    Jeste li sigurni da želite izbrisati komentar?
                </h3>
                <div className="subject-delete-comment-modal-content">
                    <p><strong>Sadržaj:</strong> {comment?.content}</p>
                    <p><strong>Ocjena praktičnosti:</strong> {comment?.ratingPracicality}</p>
                    <p><strong>Ocjena težine:</strong> {comment?.ratingDiffuculty}</p>
                    <p><strong>Ocjena očekivanja:</strong> {comment?.ratingExceptions}</p>
                    <p><strong>Datum:</strong> {new Date(comment?.createdAt || "").toLocaleDateString()}</p>
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
};  //kad se delete triba napravit ono sa filter da se automatski makne, za ovi update mislin da ce tribat ostat refresh
