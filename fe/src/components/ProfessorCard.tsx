import type {Professor} from "../constants";
import {useState} from "react";
import {AddProfessorCommentPopup, DeleteProfessorCommentPopup} from "./index";

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
                <AddProfessorCommentPopup isOpen = {isOpenAdd} onClose={() => setIsOpenAdd(false)} />
            </div>
            <div>
                <DeleteProfessorCommentPopup isOpen = {isOpenDelete} onClose={() => setIsOpenDelete(false)} id={prof.id} />
            </div>
        </div>
    )
}

//Popravi na backendu da je dovoljno pri brisanju passat id profesora i id usera,
// jer user ima tocno 1 komentar na specificnom profesoru