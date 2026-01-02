import {CommentProfessorCardAdminSettings} from '../components';
import type { CommentProfessor } from '../constants';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { getUnverifiedProfessorComments, getAllVerifiedProfessorComments, updateToken } from '../services';

export const AdminProfessorComments = () => {
    const [unverifiedComments, setUnverifiedComments] = useState<CommentProfessor[]>([]);
    const [verifiedComments, setVerifiedComments] = useState<CommentProfessor[]>([]);
    const [activeTab, setActiveTab] = useState<'unverified' | 'verified'>('unverified');
    const showVerified = activeTab === 'verified';

    const { token, login, logout } = useAuth();
    const navigate = useNavigate();

    const CorrectType = (raw: any): CommentProfessor => ({
        id: raw.id,
        userId: +raw.userId,
        profId: +raw.professorId,
        rating: raw.rating,
        content: raw.content,
        verified: raw.verified
    });

    useEffect(() => {
        const fetch = async () => {
            const newToken = await updateToken(token!, login, logout, navigate, []);
            if (showVerified) {
                if (verifiedComments.length > 0) return;
                const res = await getAllVerifiedProfessorComments(newToken);
                if (res?.status === 200) setVerifiedComments(res.data.map(CorrectType));
            } else {
                if (unverifiedComments.length > 0) return;
                const res = await getUnverifiedProfessorComments(newToken);
                if (res?.status === 200) setUnverifiedComments(res.data.map(CorrectType));
            }
        };
        void fetch();
    }, [activeTab]);

    const commentsToShow = showVerified ? verifiedComments : unverifiedComments;

    return (
        <div>
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'unverified' ? 'active' : ''}`}
                    onClick={() => setActiveTab('unverified')}
                >
                    Unverified Comments
                </button>
                <button
                    className={`admin-tab ${activeTab === 'verified' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verified')}
                >
                    Verified Comments
                </button>
            </div>

            <div className="admin-users-container">
                {commentsToShow.map(C => (
                    <CommentProfessorCardAdminSettings key={C.id} {...C} />
                ))}
                {commentsToShow.length === 0 && <p>No comments to display.</p>}
            </div>
        </div>
    );
};
