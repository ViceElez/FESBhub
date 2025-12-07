import axios from "axios"
import { useEffect, useState} from 'react';
import type { Professor } from '../constants/professorType';
import {useAuth} from "../hooks";
import {jwtDecode} from "jwt-decode";

interface PopupProperties {
    isOpen: boolean
    onClose: () => void
}


export const ProfessorCard = ({ prof }: { prof: Professor }) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    return (
        <div style = {{ border: '1px solid black', padding: '10px', margin: '10px' }} >
            <div>
                <h2>{prof.firstName} {prof.lastName}</h2>
                <p>Uže područje interesa: {prof.specialization}</p>
                <p>Obrazovanje: {prof.education}</p>
                <p>Email: {prof.email}</p>
                <p>Ocjena: {prof.rating}</p>
            </div>
            <div style = {{ marginBottom: '10px' }} >
                <button onClick = {() => setIsOpenAdd(true)}>Dodaj komentar</button>
                <button onClick = {() => setIsOpenDelete(true)}>Izbriši komentar</button>
            </div>
            <div>
                <AddCommentPopup isOpen = {isOpenAdd} onClose={() => setIsOpenAdd(false)} />
            </div>
            <div>
                <DeleteCommentPopup isOpen = {isOpenDelete} onClose={() => setIsOpenDelete(false)} id={prof.id} />
            </div>
        </div>
    )
}
//Popravi na backendu da je dovoljno pri brisanju passat id profesora i id usera,
// jer user ima tocno 1 komentar na specificnom profesoru


//= ({ isOpen, onClose, children }: ModalProps) => { ... }
export const AddCommentPopup = ({isOpen, onClose}: PopupProperties) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const {token}=useAuth()
    const decode=jwtDecode(token!) as any;
    const userId=decode?.sub
    // const decode=decodeJwtPayload(token??undefined)
    // const userId=decode?.sub


    if (!isOpen) return null;

    return (
        <div>
            <input type = "text" name = "content" placeholder = "Ovdje upišite svoj komentar" onChange = {(e) => setContent(e.target.value)}/>
            <input type = "number" name = "rating" placeholder = "Ovdje upišite ocjenu profesora" onChange = {(e) => setRating(Number(e.target.value))}/>
            <button onClick = {() => {axios.post('http://localhost:3000/comment-prof', {content, rating,userId},{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            })
                                    onClose()}}>
                Potvrdi
            </button>
        </div>
    )
}

export const DeleteCommentPopup = ({isOpen, onClose, id}: PopupProperties & {id: number}) => {

    if(!isOpen) return null;

    return (
        <div>
            <button onClick = {() => {axios.delete(`http://localhost:3000/prof/${id}`)
                                    onClose();  }}>
                Potvrdi
            </button>
        </div>
    )
}

export const ProfessorPage = () => {

    // Testno fetchanje profesora iz baze/backenda
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
            <ul style = {{ display: 'flex', flexDirection: 'row', justifyContent : 'space-evenly' , flexWrap: 'wrap' }}>
                {professors.map(professor => (
                    <li key={professor.id}><ProfessorCard prof = {professor} /></li>
                ))}
            </ul>
        </div>
    )

}


