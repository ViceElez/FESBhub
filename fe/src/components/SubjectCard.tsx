import type { Subject } from "../constants"
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { getSubjectComments, getVerifiedSubjectComments, updateToken } from "../services";
import { AddSubjectComments, DeleteSubjectCommentPopup, UpdateSubjectCommentPopup, CSCardNormal } from "./index";
import type { CommentSubject } from "../constants";

export const SubjectCard = (subject: Subject) => {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [existingComment, setExistingComment] = useState(false);
    const [verifiedComments, setVerifiedComments] = useState<CommentSubject[]>([]);
    const [showVerifiedComments, setShowVerifiedComments] = useState(false);

    const { token: rawToken, login, logout } = useAuth();
    const navigate = useNavigate();
    const decode = rawToken ? jwtDecode(rawToken) : null;
    const userId = decode?.sub;
    let token = rawToken;

    const CorrectType = (raw: any): CommentSubject => ({
        id: raw.id,
        userId: +raw.userId,
        subjId: +raw.subjectId,
        ratingPracticality: +raw.ratingPracicality,
        ratingDifficulty: +raw.ratingDiffuculty,
        ratingExpectation: +raw.ratingExceptions,
        content: raw.content,
        verified: raw.verified === true || raw.verified === "true",
    });

    useEffect(() => {
        const fetchUserComment = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res = await getSubjectComments(subject.id, token, userId);
            if (res?.status === 200) setExistingComment(!!res.data);
            else console.log("Error fetching user comment");
        };
        void fetchUserComment();
    }, [subject.id]);

    useEffect(() => {
        const fetchVerifiedComments = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res = await getVerifiedSubjectComments(subject.id, token);
            if (res?.status === 200) setVerifiedComments(res.data.map(CorrectType));
            else console.log("Error fetching verified comments");
        };
        void fetchVerifiedComments();
    }, [subject.id]);

    const handleDelete = () => {
        setExistingComment(false);
        setVerifiedComments(prev => prev.filter(comment => comment.userId !== Number(userId)));
    }

    return (
        <div className="subject-card">
            <div className="subject-card-header">
                <h2>{subject.title}</h2>
                <p>Ocjena očekivanja: {subject.ratingExpectations.toFixed(2)}</p>
                <p>Ocjena praktičnosti: {subject.ratingPracticality.toFixed(2)}</p>
                <p>Ocjena težine: {subject.ratingDifficulty.toFixed(2)}</p>
            </div>

            <div className="subject-card-buttons">
                {!existingComment && (
                    <button className="btn-add" onClick={() => setIsOpenAdd(true)}>Dodaj komentar</button>
                )}
                {existingComment && (
                    <>
                        <button className="btn-update" onClick={() => setIsOpenUpdate(true)}>Izmjeni komentar</button>
                        <button className="btn-delete" onClick={() => setIsOpenDelete(true)}>Izbriši komentar</button>
                    </>
                )}
            </div>

            <AddSubjectComments
                isOpen={isOpenAdd}
                onClose={() => setIsOpenAdd(false)}
                id={subject.id}
                onSuccess={() => setExistingComment(true)}
            />
            <DeleteSubjectCommentPopup
                isOpen={isOpenDelete}
                id={subject.id}
                onClose={() => setIsOpenDelete(false)}
                onSuccess={handleDelete}
            />
            <UpdateSubjectCommentPopup
                isOpen={isOpenUpdate}
                id={subject.id}
                onClose={() => setIsOpenUpdate(false)}
            />

            <div className="subject-card-comments-toggle">
                <button onClick={() => setShowVerifiedComments(prev => !prev)}>
                    {showVerifiedComments ? "Sakrij komentare" : "Prikaži komentare"}
                </button>
            </div>

            {showVerifiedComments && (
                <div className="subject-card-comments">
                    {verifiedComments.map(comment => (
                        <CSCardNormal key={comment.id} comment={comment} show={showVerifiedComments} />
                    ))}
                </div>
            )}
        </div>
    );
};
