import {CPCard} from './CommentOnProfessorCardForValidation.tsx';
import type { CommentProfessor } from '../constants';
import { useEffect, useState} from 'react';
import type { GoofyahhBOOL } from '../constants';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { updateToken } from '../services/updateToken.ts';
import { getUnverifiedProfessorComments } from '../services/professorCommentsApi.ts';

export const ShowUnverifiedProfComments = (show: GoofyahhBOOL) => {
    if(show.goofyahh === false)
        return <div></div>;

    const [comments, setComments] = useState<CommentProfessor[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();



    useEffect(() => {
        const fetchUnverified = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getUnverifiedProfessorComments(token);
            if(response?.status===200){
                //sve ok
                setComments(response.data);
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
                        <CPCard {...C}/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

