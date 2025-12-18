import { useEffect, useState} from 'react';
import type { Professor } from '../constants';
import {ProfessorCard} from '../components'
import {get24Professors} from "../services";
import {useAuth} from "../hooks";

export const ProfessorPage = () => {
    // Testno fetchanje profesora iz baze/backenda
    const [professors, setProfessors] = useState<Professor[]>([]);
    const {token}=useAuth()

    useEffect(() => {
        const fetchProfessors = async () => {
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


