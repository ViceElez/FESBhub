import { useEffect, useState} from 'react';
import type { Professor } from '../constants';
import {ProfessorCard} from '../components'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken } from "../services/updateToken.ts";
import axios from "axios";
import { Link } from "react-router-dom";
import { routes } from '../constants/routes.ts';

export const ProfessorPage = () => {

    const [professors, setProfessors] = useState<Professor[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfessors = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            axios.get<Professor[]>("http://localhost:3000/prof",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then(response => {
                setProfessors(response.data);
            })
        };
        void fetchProfessors();
    }, []);

    return(
        <div>
            <Link to={routes.NEWSPAGE}>
                <button>NEWSPAGE</button>
            </Link>
            <Link to={routes.SUBJECTPAGE}>
                <button>SUBJECTPAGE</button>
            </Link>
            <Link to={routes.MATERIALSPAGE}>
                <button>MATERIALS</button>
            </Link>
            <Link to={routes.ADMINSETTINGSPAGE}>
                <button>ADMINSETTINGSPAGE</button>
            </Link>
            <h1>Professor Page</h1>
            <p>This is the professor page.</p>
            <div
                style = {{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {professors.map(professor => (
                    <div key={professor.id}>
                        <ProfessorCard prof = {professor} profId = {professor.id}/>
                    </div>
                ))}
            </div>
        </div>
    )

}

