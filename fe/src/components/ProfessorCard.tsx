import type {CardProperties} from "../constants";
import {useState} from "react";
import {AddProfessorCommentPopup, DeleteProfessorCommentPopup, UpdateProfessorCommentPopup} from "./index";

export const ProfessorCard = ({prof, profId}: CardProperties) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)

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
                <button onClick = {() => {setIsOpenAdd(true), setIsOpenDelete(false), setIsOpenDelete(false)}}>Dodaj komentar</button>
                <button onClick = {() => {setIsOpenAdd(false), setIsOpenDelete(true), setIsOpenDelete(false)}}>Izbriši komentar</button>
                <button onClick = {() => {setIsOpenAdd(false), setIsOpenDelete(false), setIsOpenDelete(true)}}>Izmjeni komentar</button>
            </div>
            <div>
                <AddProfessorCommentPopup isOpen = {isOpenAdd} onClose = {() => setIsOpenAdd(false)} profId = {profId} />
            </div>
            <div>
                <DeleteProfessorCommentPopup isOpen = {isOpenDelete} onClose = {() => setIsOpenDelete(false)} profId = {profId} />
            </div>
            <div>
                <UpdateProfessorCommentPopup isOpen = {isOpenUpdate} onClose = {() => setIsOpenUpdate(false)} profId = {profId} />
            </div>
        </div>
    )
}


