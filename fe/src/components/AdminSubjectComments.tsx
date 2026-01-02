import {CommentSubjectCardAdminSettings} from '../components';
import type { CommentSubject } from '../constants';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { getAllVerifiedSubjectComments, getUnverifiedSubjectComments, updateToken } from '../services';

export const AdminSubjectComments = () => {
    const [unverifiedComments, setUnverifiedComments] = useState<CommentSubject[]>([]);
    const [verifiedComments, setVerifiedComments] = useState<CommentSubject[]>([]);
    const [activeTab, setActiveTab] = useState<'unverified' | 'verified'>('unverified');
    const showVerified = activeTab === 'verified';

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
            if (showVerified) {
                if (verifiedComments.length > 0) return;
                const res = await getAllVerifiedSubjectComments(token);
                if (res?.status === 200) setVerifiedComments(res.data.map(CorrectType));
            } else {
                if (unverifiedComments.length > 0) return;
                const res = await getUnverifiedSubjectComments(token);
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
                    <CommentSubjectCardAdminSettings key={C.id} {...C} />
                ))}
                {commentsToShow.length === 0 && <p>No comments to display.</p>}
            </div>
        </div>
    );
};
