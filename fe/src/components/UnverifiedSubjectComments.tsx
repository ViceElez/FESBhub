import {CSCard,CSCardAdminNormal} from '../components';
import type { CommentSubject } from '../constants';
import { useEffect, useState} from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { getUnverifiedSubjectComments, getAllVerifiedSubjectComments,updateToken } from '../services';

export const ShowAdminSubjComments = ({ show }: { show: number }) => {

    const [Unverifiedcomments, setUnverifiedComments] = useState<CommentSubject[]>([]);
    const [verifiedComments, setVerifiedComments] = useState<CommentSubject[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    const CorrectType = (raw: any): CommentSubject => {
        const corrected: CommentSubject = {
            id: raw.id,
            userId: +raw.userId,
            subjId: +raw.subjectId,
            ratingPracticality: +raw.ratingPracicality,
            ratingDifficulty: +raw.ratingDiffuculty,
            ratingExpectation: +raw.ratingExceptions,
            content: raw.content,
            verified: raw.verified
        };
        return corrected;
    };

    useEffect(() => {
        const fetchUnverified = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getUnverifiedSubjectComments(token);
            if(response?.status===200){
                setUnverifiedComments(response.data.map(CorrectType));
            }
            else
                alert('Error')
        }
        const fetchVerified = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getAllVerifiedSubjectComments(token);
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
        <div>
            <div className = "cards-container-scroll-horizontally">
                {verifiedComments.map(C => (
                    <div key={C.id}>
                        <CSCardAdminNormal {...C}/>
                    </div>
                ))}
            </div>
        </div>
        );
    }

    else if(show === 2){
        return (
        <div>
            <div className = "cards-container-scroll-horizontally">
                {Unverifiedcomments.map(C => (
                    <div key={C.id}>
                        <CSCard {...C}/>
                    </div>
                ))}
            </div>
        </div>
        );
    }

    else{
        return <div></div>;
    }
}

