import {CSCard} from './CommentOnSubjectCardForValidation.tsx';
import type { CommentSubject } from '../constants';
import { useEffect, useState} from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { updateToken } from '../services/updateToken.ts';
import { getUnverifiedSubjectComments } from '../services/subjectCommentsApi.ts';

export const ShowUnverifiedSubjComments = ({ show }: { show: boolean }) => {
    if(show === false)
        return <div></div>;

    const [comments, setComments] = useState<CommentSubject[]>([]);

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
                setComments(response.data.map(CorrectType));
            }
            else
                alert('Error')
        }
        void fetchUnverified();
    }, []);

    return (
        <div>
            <div
                style = {{ display: 'flex', flexDirection: 'row', justifyContent : 'space-evenly' , flexWrap: 'wrap' }}>
                {comments.map(C => (
                    <div key={C.id}>
                        <CSCard {...C}/>
                    </div>
                ))}
            </div>
        </div>
    );
}