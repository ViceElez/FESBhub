import type {CardProperties} from "../constants";
import {useState, useEffect} from "react";
import {AddProfessorCommentPopup, DeleteProfessorCommentPopup, UpdateProfessorCommentPopup} from "./index";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {getProfessorComments, newAccessToken, tokenIsExpired,CheckIfCommentExists} from "../services";
import {routes} from "../constants/routes.ts";
import {useNavigate} from "react-router-dom";

export const ProfessorCard = ({prof, profId}: CardProperties) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)
    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate=useNavigate()
    const [existingComment, setExistingComment] = useState(false);


    useEffect(() => {
        const fetchProfessorComments = async () => {
            const expired = token ? tokenIsExpired(token) : true;
            if(expired){
                const newAccessTokenResponse=await newAccessToken()
                if(newAccessTokenResponse?.status!==201){
                    alert('Please login again')
                    logout()
                    navigate(routes.LOGIN)
                }
                else{
                    login(newAccessTokenResponse.data)
                    token=newAccessTokenResponse.data
                }
            }
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


