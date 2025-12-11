import type {CardProperties} from "../constants";
import {useState} from "react";
import {AddProfessorCommentPopup, DeleteProfessorCommentPopup, UpdateProfessorCommentPopup} from "./index";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import axios from "axios";

export const ProfessorCard = ({prof, profId}: CardProperties) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)

    const {token} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const [existingComment, setExistingComment] = useState(false);

    const E = axios.get(`http://localhost:3000/comment-prof/exists?profId=${profId}&userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        setExistingComment(!response.data);
    });

    console.log(E)

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
                <button 
                disabled = {(existingComment === true) ? false: true}
                onClick = {() => {setIsOpenAdd(true), setIsOpenDelete(false), setIsOpenUpdate(false)}}>
                    Dodaj komentar
                </button>
                <button onClick = {() => {setIsOpenAdd(false), setIsOpenDelete(true), setIsOpenUpdate(false)}}
                        disabled = {(existingComment === true) ? true: false}>
                    Izbriši komentar
                </button>
                <button onClick = {() => {setIsOpenAdd(false), setIsOpenDelete(false), setIsOpenUpdate(true)}}
                        disabled = {(existingComment === true) ? true: false}>
                    Izmjeni komentar
                </button>
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


