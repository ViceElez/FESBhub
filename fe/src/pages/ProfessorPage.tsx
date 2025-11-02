import axios from "axios"
import { useEffect, useState } from 'react';
import type { Professor } from '../constants/professorType';


export const ProfessorPage = () => {

    const [professors, setProfessors] = useState<Professor[]>([]);

    useEffect(() => {
        axios.get<Professor[]>("http://localhost:3000/prof").then(response => {
            setProfessors(response.data);
        })
    }, [])
    return(
        <div>
            <h1>Professor Page</h1>
            <p>This is the professor page.</p>
            <ul>
                {professors.map(professor => (
                    <li key={professor.firstName}>{professor.firstName} {professor.lastName}</li>
                ))}
            </ul>
        </div>
    )
}

