import {CPCard} from './CommentOnProfessorCardForValidation.tsx';
import { CPCardAdminNormal } from './CommentOnProfessorCardAdminNormal.tsx';
import type { CommentProfessor } from '../constants';
import { useEffect, useState} from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { updateToken } from '../services/updateToken.ts';
import { getUnverifiedProfessorComments, getAllVerifiedProfessorComments } from '../services/professorCommentsApi.ts';

export const ShowAdminProfComments = ({ show }: { show: number }) => {

    const [unverifiedComments, setUnverifiedComments] = useState<CommentProfessor[]>([]);
    const [verifiedComments, setVerifiedComments] = useState<CommentProfessor[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    const CorrectType = (raw: any): CommentProfessor => {
        const corrected: CommentProfessor = {
            id: raw.id,
            userId: +raw.userId,
            profId: +raw.professorId,
            rating: raw.rating,
            content: raw.content,
            verified: raw.verified
        };
        return corrected;
    };

    useEffect(() => {
        const fetchUnverified = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getUnverifiedProfessorComments(token);
            if(response?.status===200){
                setUnverifiedComments(response.data.map(CorrectType));
            }
            else
                alert('Error')
        }
        const fetchVerified = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getAllVerifiedProfessorComments(token);
            if(response?.status===200){
                setVerifiedComments(response.data.map(CorrectType));
            }
            else
                alert('Error')
        }
        void fetchVerified();
        void fetchUnverified();
    }, []);

    if(show === 1){
        return (
            <div className = "cards-container-scroll-horizontally">
                {verifiedComments.map(C => (
                    <div key={C.id}>
                        <CPCardAdminNormal {...C}/>
                    </div>
                ))}
            </div>
        );
    }
    else if(show === 2){
        return (
            <div>
                <div className = "cards-container-scroll-horizontally">
                    {unverifiedComments.map(C => (
                        <div key={C.id}>
                            <CPCard {...C}/>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    else {
        return <div></div>;
    }
}

