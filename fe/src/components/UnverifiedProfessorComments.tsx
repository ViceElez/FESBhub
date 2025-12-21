import {CPCard} from './CommentOnProfessorCardForValidation.tsx';
import type { CommentProfessor } from '../constants';
import { useEffect, useState} from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { updateToken } from '../services/updateToken.ts';
import { getUnverifiedProfessorComments } from '../services/professorCommentsApi.ts';

export const ShowUnverifiedProfComments = ({ show }: { show: boolean }) => {
    if(show === false)
        return <div></div>;

    const [comments, setComments] = useState<CommentProfessor[]>([]);

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
                setComments(response.data.map(CorrectType));
                console.log(response.data);
            }
            else
                alert('Error')
        }
        void fetchUnverified();
    }, []);

    return (
        <div>
            <ul
                style = {{ display: 'flex', flexDirection: 'row', justifyContent : 'space-evenly' , flexWrap: 'wrap' }}>
                {comments.map(C => (
                    <li key={C.id}>
                        <h5>
                            Id profesora je {C.profId} , Id korisnika je {C.userId}
                        </h5>
                        <CPCard {...C}/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

