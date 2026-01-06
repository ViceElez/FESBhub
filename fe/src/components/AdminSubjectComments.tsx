import {CommentSubjectCardAdminSettings} from '../components';
import type { CommentSubject } from '../constants';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { getUnverifiedSubjectComments, updateToken } from '../services';

export const AdminSubjectComments = () => {
    const [subjComments, setSubjComments] = useState<CommentSubject[]>([]);
    let { token, login, logout } = useAuth();
    const navigate = useNavigate();

    const CorrectType = (raw: any): CommentSubject => ({
        id: raw.id,
        userId: +raw.userId,
        subjId: +raw.subjectId,
        ratingPracticality: +raw.ratingPracicality,
        ratingDifficulty: +raw.ratingDiffuculty,
        ratingExpectation: +raw.ratingExceptions,
        content: raw.content,
        verified: raw.verified
    });

    useEffect(() => {
        const fetch = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res= await getUnverifiedSubjectComments(token);
            if (res?.status === 200) setSubjComments(res.data.map(CorrectType));
        };
        void fetch();
    }, []);

    const removeComment = (id: number) => {
        setSubjComments(prev => prev.filter(c => c.id !== id));
    }

    return (
        <div className="admin-comments-wrapper">
            {subjComments.map(C => (
                <CommentSubjectCardAdminSettings key={C.id} comment={C} onRemove={removeComment}/>
            ))}
            {subjComments.length === 0 && <p>No comments to display.</p>}
        </div>
    );
};
