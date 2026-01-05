import {CommentProfessorCardAdminSettings} from '../components';
import type { CommentProfessor } from '../constants';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import {getUnverifiedProfessorComments, updateToken} from '../services';
import '../index.css';

export const AdminProfessorComments = () => {
    const [profComments, setProfComments] = useState<CommentProfessor[]>([]);
    let { token, login, logout } = useAuth();
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
        const fetch = async () =>{
            token = await updateToken(token!, login, logout, navigate, []);
            const res=await getUnverifiedProfessorComments(token)
            if (res?.status === 200) setProfComments(res.data.map(CorrectType));
        }
        void fetch();
    }, );

    return (
        <div className="admin-comments-wrapper">
            {profComments.map(C => (
                <CommentProfessorCardAdminSettings key={C.id} {...C} />
            ))}
            {profComments.length === 0 && <p>No comments to display.</p>}
        </div>
    );

};
