import {CSCard, CSCardAdminNormal} from '../components';
import type {CommentSubject} from '../constants';
import {useEffect, useState} from 'react';
import {useAuth} from '../hooks';
import {useNavigate} from 'react-router-dom';
import {getAllVerifiedSubjectComments, getUnverifiedSubjectComments, updateToken} from '../services';

export const ShowAdminSubjComments = ({ showVerified }: { showVerified: boolean }) => {

    const [unverifiedComments, setUnverifiedComments] = useState<CommentSubject[]>([]);
    const [verifiedComments, setVerifiedComments] = useState<CommentSubject[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    const CorrectType = (raw: any): CommentSubject => {
        return {
            id: raw.id,
            userId: +raw.userId,
            subjId: +raw.subjectId,
            ratingPracticality: +raw.ratingPracicality,
            ratingDifficulty: +raw.ratingDiffuculty,
            ratingExpectation: +raw.ratingExceptions,
            content: raw.content,
            verified: raw.verified
        };
    };

    useEffect(() => {
        const fetch= async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            if (showVerified) {
                if (verifiedComments.length > 0) return;
                const res = await getAllVerifiedSubjectComments(token);
                if (res?.status === 200) {
                    setVerifiedComments(res.data.map(CorrectType));
                }
            } else {
                if (unverifiedComments.length > 0) return;
                const res = await getUnverifiedSubjectComments(token);
                if (res?.status === 200) {
                    setUnverifiedComments(res.data.map(CorrectType));
                }
            }
        }; //fixat verificiraj(vjerojatno kako san minja raspored, bice ista greska i za prof)
        void fetch();
    }, [showVerified]);

    return(
        <div className = "cards-container-scroll-horizontally">
            {(showVerified? verifiedComments : unverifiedComments).map(C => (
                <div key={C.id}>
                    {showVerified ? (
                        <CSCardAdminNormal {...C} />
                    ) : (
                        <CSCard {...C} />
                    )}
                </div>
            ))
            }
        </div>
    )
}

