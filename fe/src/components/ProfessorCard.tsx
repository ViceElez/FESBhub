import type {CardProperties} from "../constants";
import {useState, useEffect} from "react";
import {AddProfessorCommentPopup, DeleteProfessorCommentPopup, UpdateProfessorCommentPopup} from "./index";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import axios from "axios";
import { CheckIfCommentExists } from "../services/checkCommentProf";

export const ProfessorCard = ({prof, profId}: CardProperties) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)
    const {token} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const [existingComment, setExistingComment] = useState(false);


    /* //ovo baca authization error na momente neman blage zasto, jer dosl radi par puta skroz normalno sve i onda samo baci error
    useEffect(() => {
        axios.get(`http://localhost:3000/comment-prof/exists?profId=${profId}&userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        setExistingComment(!response.data);
    })}); */

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
                disabled = {(userId == null || token == null) ? true : !CheckIfCommentExists(profId, +userId, token)}
                onClick = {() => {setIsOpenAdd(true), setIsOpenDelete(false), setIsOpenUpdate(false), setExistingComment(true)}}>
                    Dodaj komentar
                </button>
                <button onClick = {() => {setIsOpenAdd(false), setIsOpenDelete(true), setIsOpenUpdate(false), setExistingComment(false)}}
                        disabled = {(userId == null || token == null) ? true : CheckIfCommentExists(profId, +userId, token)}>
                    Izbriši komentar
                </button>
                <button onClick = {() => {setIsOpenAdd(false), setIsOpenDelete(false), setIsOpenUpdate(true), setExistingComment(true)}}
                        disabled = {(userId == null || token == null) ? true : CheckIfCommentExists(profId, +userId, token)}>
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


