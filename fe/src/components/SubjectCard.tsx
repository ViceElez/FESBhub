import type { Subject } from "../constants"
import {useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../services/updateToken.ts";
import {getSubjectComments, getVerifiedSubjectComments} from "../services";
import {AddSubjectComments, DeleteSubjectCommentPopup, UpdateSubjectCommentPopup} from "./index";
import type {CommentSubject} from "../constants";
import { CSCardNormal } from "./index";

export const SubjectCard = ( subject: Subject) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)
    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate = useNavigate()
    const [existingComment, setExistingComment] = useState(false);
    const [verifiedComments, setVerifiedComments] = useState<CommentSubject[]>([]);
    const [showVerifiedComments, setShowVerifiedComments] = useState(false);

    const CorrectType = (raw: any): CommentSubject => {
        const corrected: CommentSubject = {
            id: raw.id,
            userId: +raw.userId,
            subjId: +raw.subjectId,
            ratingPracticality: +raw.ratingPracicality,
            ratingDifficulty: +raw.ratingDiffuculty,
            ratingExpectation: +raw.ratingExceptions,
            content: raw.content,
            verified: raw.verified
        };
        return corrected;
    };

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

    useEffect(() => {
        const fetchVerifiedComments = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getVerifiedSubjectComments(subject.id, token);
            if (response?.status === 200) {
                setVerifiedComments(response.data.map(CorrectType));
            } else {
                alert('Error fetching verified comments');
            }
        };
        void fetchVerifiedComments();
    }, [subject.id]);

    return (
        <div className="card" >
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
            <div>
                <button onClick={() => setShowVerifiedComments(!showVerifiedComments)}>
                    {showVerifiedComments ? 'Sakrij komentare' : 'Prikaži komentare'}
                </button>
            </div>
            <div className = "cards-container-scroll-horizontally">
                {showVerifiedComments && verifiedComments.map(comment => (
                    <div key={comment.id}>
                        <CSCardNormal comment = {comment} show = {showVerifiedComments}/>
                    </div>
                ))}
            </div>
        </div>);
}

