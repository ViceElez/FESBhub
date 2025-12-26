import type {CardProperties, CommentProfessor} from "../constants";
import {useState, useEffect} from "react";
import {AddProfessorCommentPopup, DeleteProfessorCommentPopup, UpdateProfessorCommentPopup} from "./index";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {getProfessorComments} from "../services";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../services/updateToken.ts";
import {getVerifiedProfessorComments} from "../services/professorCommentsApi.ts";
import { CPCardNormal } from "./index";

export const ProfessorCard = ({prof, profId}: CardProperties) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)
    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate = useNavigate()
    const [existingComment, setExistingComment] = useState(false);
    const [verifiedComments, setVerifiedComments] = useState<CommentProfessor[]>([]);
    const [showVerifiedComments, setShowVerifiedComments] = useState(false);

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

    useEffect(() => {
        const fetchVerifiedComments = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getVerifiedProfessorComments(profId, token);
            if (response?.status === 200) {
                setVerifiedComments(response.data);
            } else {
                alert('Error fetching verified comments');
            }
        };
        void fetchVerifiedComments();
    }, [profId]);

    return (
        <div className = "card" >
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
                    id = {profId}
                    onSuccess={() => setExistingComment(true)}
                />
            </div>
            <div>
                <DeleteProfessorCommentPopup
                    isOpen = {isOpenDelete}
                    onClose = {() => setIsOpenDelete(false)}
                    id = {profId}
                    onSuccess={()=> setExistingComment(false)}
                />
            </div>
            <div>
                <UpdateProfessorCommentPopup
                    isOpen = {isOpenUpdate}
                    onClose = {() => setIsOpenUpdate(false)}
                    id = {profId}
                />
            </div>
            <div>
                <button onClick={() => setShowVerifiedComments(!showVerifiedComments)}>
                    {showVerifiedComments ? 'Sakrij komentare' : 'Prikaži komentare'}
                </button>
            </div>
            <div className = "cards-container-scroll-horizontally">
                {verifiedComments.map(comment => (
                    <div key={comment.id}>
                        <CPCardNormal comment = {comment} show = {showVerifiedComments}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

