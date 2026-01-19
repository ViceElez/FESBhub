import { useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import {deleteSubjectComment, getAllCommentsBySubjectId, updateToken} from '../services';

type AdminSettingSubjectTabCommentsProps = {
    open: boolean;
    close: () => void;
    subj: Subject;
};

type SubjComment = {
    id: number;
    content: string;
    ratingExceptions: number;
    ratingPracicality: number;
    ratingDiffuculty: number;
    verified: boolean;
    createdAt: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
    };
};

type Subject = {
    id: number;
    title: string;
    ratingExpectations: number;
    ratingPracticality: number;
    ratingDifficulty: number;
    nositelj: number;
    audtiorne: number;
    comments: [];
};

export const AdminSettingSubjectTabComments = ({open, close, subj}: AdminSettingSubjectTabCommentsProps) => {
    const [subjComments, setSubjComments] = useState<SubjComment[]>([]);
    let { token, login, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;

        const fetchSubjComments = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res = await getAllCommentsBySubjectId(subj.id, token);
            if (res?.status === 200) {
                setSubjComments(res.data);
            }
        };

        void fetchSubjComments();
    }, [open, subj.id]);

    const handleDelete = async (userId:number) => {
        token = await updateToken(token!, login, logout, navigate, []);
        if(!confirm('Are you sure you want to delete this comment?')) {
            return;
        }
        const response = await deleteSubjectComment(subj.id, token, userId);
        if (response?.status === 200) {
            setSubjComments(prevComments => prevComments.filter(comment => comment.user.id !== userId));
            alert("Successfully deleted comment");
        } else {
            alert("Error deleting comment");
        }
    }

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={close}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close-btn" onClick={close}>
                    ✕
                </button>

                <h2>Comments for Subject: {subj.title}</h2>

                <div className="modal-content">
                    {subjComments.length === 0 ? (
                        <p className="empty-msg">
                            No comments available for this subject.
                        </p>
                    ) : (
                        subjComments.map((comment) => (
                            <div key={comment.id} className="comment-card-view-comments">
                                <p>
                                    <strong>
                                        {comment.user.firstName}{' '}
                                        {comment.user.lastName}
                                    </strong>
                                </p>

                                <p>{comment.content}</p>

                                <p>
                                    Expectations:{' '}
                                    <strong>
                                        {comment.ratingExceptions.toFixed(2)}
                                    </strong>
                                </p>

                                <p>
                                    Practicality:{' '}
                                    <strong>
                                        {comment.ratingPracicality.toFixed(2)}
                                    </strong>
                                </p>

                                <p>
                                    Difficulty:{' '}
                                    <strong>
                                        {comment.ratingDiffuculty.toFixed(2)}
                                    </strong>
                                </p>

                                <p>
                                    {comment.verified
                                        ? 'Verified'
                                        : 'Unverified'}{' '}
                                    •{' '}
                                    {new Date(
                                        comment.createdAt
                                    ).toLocaleDateString()}
                                </p>
                                <button className="delete-btn" onClick={()=>handleDelete(comment.user.id)}>Delete</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
