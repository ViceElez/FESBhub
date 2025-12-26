import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";
import {useEffect, useState} from "react";
import { get24Subjects, updateToken} from "../services";

type ProfessorComments = {
    id: number;
    professorName: string;
    comment: string;
    verified: boolean;
};

export const AdminProfessorCard = () => {
    const navigate = useNavigate();
    let { token,login,logout } = useAuth();
    const [professorComments, setProfessorComments] = useState<ProfessorComments[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                token = await updateToken(token!, login, logout, navigate, []);
                const comments = await get24Subjects(token);
                console.log(comments)
                setProfessorComments(comments);
            } finally {
                setLoading(false);
            }
        }
        void fetchUsers();
    }, []);

    if (loading) return <p>Loading professor comments...</p>;

  return (
    <div>
        <h3>Professor:</h3>
        {professorComments.map(c => (
            <div key={c.id}>
                <p>Professor: {c.professorName}</p>
                <p>Comment: {c.comment}</p>
                <p>Verified: {c.verified ? 'Yes' : 'No'}</p>
            </div>
        ))}
    </div>
  );
} //znaci napravi verificiraj botun i onda nek se tu bira verificiraj usera, post,profcom, subcom, a odi nek ne izlistaju samo useri,post,prof,subj