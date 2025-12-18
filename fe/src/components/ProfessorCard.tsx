import type {CardProperties} from "../constants";
import {useState, useEffect} from "react";
import {AddProfessorCommentPopup, DeleteProfessorCommentPopup, UpdateProfessorCommentPopup} from "./index";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {getProfessorComments} from "../services";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../services/updateToken.ts";

export const ProfessorCard = ({prof, profId}: CardProperties) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)
    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate = useNavigate()
    const [existingComment, setExistingComment] = useState(false);


    useEffect(() => {
        const fetchProfessorComments = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response=await getProfessorComments(profId,token,userId)
            if(response?.status===200)
                setExistingComment(response.data)

            else
                alert('Error')
        }
        void fetchProfessorComments()
    },[]);

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
                <AddProfessorCommentPopup
                    isOpen = {isOpenAdd}
                    onClose = {() => setIsOpenAdd(false)}
                    profId = {profId}
                    onSuccess={() => setExistingComment(true)}
                />
            </div>
            <div>
                <DeleteProfessorCommentPopup
                    isOpen = {isOpenDelete}
                    onClose = {() => setIsOpenDelete(false)}
                    profId = {profId}
                    onSuccess={()=> setExistingComment(false)}
                />
            </div>
            <div>
                <UpdateProfessorCommentPopup
                    isOpen = {isOpenUpdate}
                    onClose = {() => setIsOpenUpdate(false)}
                    profId = {profId}
                />
            </div>
        </div>
    )
}


