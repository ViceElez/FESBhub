import axios from "axios"
import { useEffect, useState} from 'react';
import type { Professor } from '../constants';
import {ProfessorCard} from '../components'

export const ProfessorPage = () => {

    // Testno fetchanje profesora iz baze/backenda
    const [professors, setProfessors] = useState<Professor[]>([]);

    useEffect(() => {
        axios.get<Professor[]>("http://localhost:3000/prof").then(response => {
            setProfessors(response.data);
        })
    }, [])

    const getDivId=(professorId:any)=>{
        console.log(professorId) //odi se ispisuje id profesora, mos dalje snjin sta os
    }

    return(
        <div>
            <h1>Professor Page</h1>
            <p>This is the professor page.</p>
            <ul
                style = {{ display: 'flex', flexDirection: 'row', justifyContent : 'space-evenly' , flexWrap: 'wrap' }}>
                {professors.map(professor => (
                    <li key={professor.id}
                    onClick={() =>getDivId(professor.id) }
                    ><ProfessorCard prof = {professor} /></li>
                ))}
            </ul>
        </div>
    )

}


