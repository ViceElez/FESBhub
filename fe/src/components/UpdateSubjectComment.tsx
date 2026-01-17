import { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { editSubjectComments, getSubjectCommentBySubjectAndUserId, updateToken } from "../services";
import { createPortal } from "react-dom";
import '../index.css'
import type {UpdateCommentPopupProperties} from "../constants";

export const UpdateSubjectCommentPopup = ({ isOpen, onClose, id, onSuccess }: UpdateCommentPopupProperties) => {
    const [content, setContent] = useState("");
    const [ratingPract, setRatingPract] = useState(0);
    const [ratingDiff, setRatingDiff] = useState(0);
    const [ratingExpect, setRatingExpect] = useState(0);
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

    useEffect(() => {
        if(isOpen){
            document.body.classList.add('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        }
    }, [isOpen]);

    const handleCommentUpdate = async () => {
        token = await updateToken(token!, login, logout, navigate, [onClose]);
        const response = await editSubjectComments(id, ratingPract, ratingDiff, ratingExpect, content, token, userId);
        if (response?.status === 200) {
            alert("Updated successfully");
            const updatedComment = {
                id: comment.id,
                userId: Number(userId),
                subjId: id,
                ratingPracticality: ratingPract,
                ratingDifficulty: ratingDiff,
                ratingExpectation: ratingExpect,
                content,
                verified: true,
            };
            onSuccess?.(updatedComment);
            onClose();
        }
        else console.log("Error", response);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="subject-update-comment-modal-overlay">
            <div className="subject-update-comment-modal">
                <h2 className="subject-update-comment-modal-title">Izmijeni komentar</h2>
                <div className="subject-update-comment-modal-current">
                    <p><strong>Trenutni komentar:</strong> {comment?.content}</p>
                    <p><strong>Ocjena praktičnosti:</strong> {comment?.ratingPracicality}</p>
                    <p><strong>Ocjena težine:</strong> {comment?.ratingDiffuculty}</p>
                    <p><strong>Ocjena očekivanja:</strong> {comment?.ratingExceptions}</p>
                </div>
                <div className="subject-update-comment-modal-inputs">
                    <input
                        type="text"
                        placeholder="Novi komentar"
                        onChange={e => setContent(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Nova ocjena praktičnosti"
                        onChange={e => setRatingPract(Number(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Nova ocjena težine"
                        onChange={e => setRatingDiff(Number(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Nova ocjena očekivanja"
                        onChange={e => setRatingExpect(Number(e.target.value))}
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
                        disabled={content.length === 0 || ratingPract < 1 || ratingDiff < 1 || ratingExpect < 1}
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
