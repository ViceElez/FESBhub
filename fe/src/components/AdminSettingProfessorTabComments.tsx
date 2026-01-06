import type { Professor } from "../constants";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { getAllCommentsByProfessorId, updateToken } from "../services";
import "../index.css";

type AdminSettingProfessorTabCommentsProps = {
    open: boolean;
    close: () => void;
    professor: Professor;
};

type ProfComment = {
    id: number;
    content: string;
    rating: number;
    verified: boolean;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
    };
};

export const AdminSettingProfessorTabComments = ({open, close, professor}: AdminSettingProfessorTabCommentsProps) => {
    const [profComments, setProfComments] = useState<ProfComment[]>([]);
    let { token, login, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;

        const fetchProfComments = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res = await getAllCommentsByProfessorId(professor.id, token);
            if (res?.status === 200) {
                setProfComments(res.data);
            }
        };

        void fetchProfComments();
    }, [open, professor.id]);

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={close}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close-btn" onClick={close}>✕</button>

                <h2>
                    Comments for Prof. {professor.firstName} {professor.lastName}
                </h2>

                <div className="modal-content">
                    {profComments.length === 0 ? (
                        <p className="empty-msg">
                            No comments available for this professor.
                        </p>
                    ) : (
                        profComments.map((comment) => (
                            <div key={comment.id} className="comment-card-view-comments">
                                <p>
                                    User:
                                    <strong> {comment.user.firstName}{" "} {comment.user.lastName}
                                    </strong>
                                </p>
                                <p>Content: {comment.content}</p>
                                <p>
                                    Rating: <strong>{comment.rating.toFixed(2)}</strong>
                                </p>
                                <p>
                                    {comment.verified ? "Verified" : "Unverified"} •{" "}
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
