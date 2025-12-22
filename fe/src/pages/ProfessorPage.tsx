import { useEffect, useState} from 'react';
import type { Professor } from '../constants';
import {ProfessorCard} from '../components'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken } from "../services/updateToken.ts";


export const ProfessorPage = () => {

    const [professors, setProfessors] = useState<Professor[]>([]);
    const {token}=useAuth()

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


