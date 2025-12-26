import {CPCard,CPCardAdminNormal} from '../components';
import type { CommentProfessor } from '../constants';
import { useEffect, useState} from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { getUnverifiedProfessorComments, getAllVerifiedProfessorComments,updateToken } from '../services';

export const ShowUnverifiedProfComments = ({ showVerified }: { showVerified: boolean }) => {

    const [unverifiedComments, setUnverifiedComments] = useState<CommentProfessor[]>([]);
    const [verifiedComments, setVerifiedComments] = useState<CommentProfessor[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    const CorrectType = (raw: any): CommentProfessor => {
        return {
            id: raw.id,
            userId: +raw.userId,
            profId: +raw.professorId,
            rating: raw.rating,
            content: raw.content,
            verified: raw.verified
        };
    };

    useEffect(() => {
        const fetch = async () => {
            token = await updateToken(token!, login, logout, navigate, []);

            if (showVerified) {
                if(verifiedComments.length > 0) return;
                const res = await getAllVerifiedProfessorComments(token);
                if (res?.status === 200) {
                    setVerifiedComments(res.data.map(CorrectType));
                }
            } else {
                if(unverifiedComments.length > 0) return;
                const res = await getUnverifiedProfessorComments(token);
                if (res?.status === 200) {
                    setUnverifiedComments(res.data.map(CorrectType));
                }
            }
        }; //fixat verificiraj

        void fetch();
    }, [showVerified]);

    return (
        <div className="cards-container-scroll-horizontally">
            {(showVerified ? verifiedComments : unverifiedComments).map(C => (
                <div key={C.id}>
                    {showVerified ? (
                        <CPCardAdminNormal {...C} />
                    ) : (
                        <CPCard {...C} />
                    )}
                </div>
            ))}
        </div>
    );
}

