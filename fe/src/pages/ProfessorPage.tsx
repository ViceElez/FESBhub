import { useEffect, useState} from 'react';
import type { Professor } from '../constants';
import {ProfessorCard} from '../components'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken,get24Professors } from "../services";

export const ProfessorPage = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    let {token,login,logout}=useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfessors = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            try {
                const response = await get24Professors(token)
                setProfessors(response);
            } catch (error) {
                console.error('Error fetching professors:', error);
            }
        };
        void fetchProfessors();
    }, []);

    return(
        <div>
            <h1>Professor Page</h1>
            <p>This is the professor page.</p>
            <ul
                style = {{ display: 'flex', flexDirection: 'row', justifyContent : 'space-evenly' , flexWrap: 'wrap' }}>
                {professors.map(professor => (
                    <li key={professor.id}
                    ><ProfessorCard prof = {professor} profId = {professor.id}/></li>
                ))}
            </ul>
        </div>
    )

}


