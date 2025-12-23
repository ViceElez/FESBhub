import type { Subject } from "../constants"
import {useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../services/updateToken.ts";
import {getSubjectComments} from "../services";
import {AddSubjectComments, DeleteSubjectCommentPopup, UpdateSubjectCommentPopup} from "./index";

export const SubjectCard = ( subject: Subject) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)
    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate = useNavigate()
    const [existingComment, setExistingComment] = useState(false);

    useEffect(() => {
        const fetchSubjectComments = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getSubjectComments(subject.id, token, userId)
            if (response?.status === 200)
                setExistingComment(response.data)
            else
                alert('Error')
        }
        void fetchSubjectComments()
    }, []);

    return (
        <div style = {{ border: '1px solid black', padding: '10px', margin: '10px' }} >
            <div>
                <h2>{subject.title}</h2>
                <p>Ocjena očekivanja: {subject.ratingExpectations}</p>
                <p>Ocjena praktičnosti: {subject.ratingPracticality}</p>
                <p>Ocjena težine: {subject.ratingDifficulty}</p>
            </div>
            <div style = {{ marginBottom: '10px' }} >
                <button
                    disabled={!token || !userId || existingComment}
                    onClick={() => {
                        setIsOpenAdd(true)
                        setIsOpenDelete(false)
                        setIsOpenUpdate(false)
                    }}
                >
                    Dodaj komentar
                </button>
                <button
                    disabled={!token || !userId || !existingComment}
                    onClick={() => {
                        setIsOpenDelete(true)
                        setIsOpenAdd(false)
                        setIsOpenUpdate(false)
                    }}
                >
                    Izbriši komentar
                </button>
                <button
                    disabled={!token || !userId || !existingComment}
                    onClick={() => {
                        setIsOpenUpdate(true)
                        setIsOpenAdd(false)
                        setIsOpenDelete(false)
                    }}
                >
                    Izmjeni komentar
                </button>
            </div>
            <div>
                <AddSubjectComments
                    isOpen = {isOpenAdd}
                    onClose = {() => setIsOpenAdd(false)}
                    id = {subject.id}
                    onSuccess={() => setExistingComment(true)}
                />
            </div>
            <div>
                <DeleteSubjectCommentPopup
                    isOpen = {isOpenDelete}
                    onClose = {() => setIsOpenDelete(false)}
                    id = {subject.id}
                />
            </div>
            <div>
                <UpdateSubjectCommentPopup
                    isOpen = {isOpenUpdate}
                    onClose = {() => setIsOpenUpdate(false)}
                    id = {subject.id}
                />
            </div>
        </div>);
}

