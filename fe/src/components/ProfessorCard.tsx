import type { CardProperties, CommentProfessor } from "../constants";
import { useState, useEffect, useMemo } from "react";
import {
    AddProfessorCommentPopup,
    DeleteProfessorCommentPopup,
    UpdateProfessorCommentPopup,
    CPCardNormal,
} from "./index";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import {
    updateToken,
    getVerifiedProfessorComments,
    getProfessorComments,
} from "../services";
import "../index.css"

const calculateAverageRating = (comments: CommentProfessor[]): number => {
    if (comments.length === 0) return 0;
    const total = comments.reduce((sum, c) => sum + c.rating, 0);
    return total / comments.length;
};

export const ProfessorCard = ({ prof, profId, showDetails }: CardProperties) => {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);

    const { token: rawToken, login, logout } = useAuth();
    const navigate = useNavigate();
    const decode = rawToken ? jwtDecode(rawToken) : null;
    const userId = decode?.sub;

    const [existingComment, setExistingComment] = useState(false);
    const [verifiedComments, setVerifiedComments] = useState<CommentProfessor[]>([]);
    const [showVerifiedComments, setShowVerifiedComments] = useState(false);

    useEffect(() => {
        const fetchProfessorComments = async () => {
            const token = await updateToken(rawToken!, login, logout, navigate, []);
            const res = await getProfessorComments(profId, token, userId);
            if (res?.status === 200) {
                setExistingComment(!!res.data);
            }
        };
        void fetchProfessorComments();
    }, [profId]);

    useEffect(() => {
        const fetchVerifiedComments = async () => {
            const token = await updateToken(rawToken!, login, logout, navigate, []);
            const res = await getVerifiedProfessorComments(profId, token);
            if (res?.status === 200) {
                setVerifiedComments(res.data);
            }
        };
        void fetchVerifiedComments();
    }, [profId]);

    const averageRating = useMemo(
        () => calculateAverageRating(verifiedComments),
        [verifiedComments]
    );

    const renderRatingStars = (rating: number) => {
        const full = Math.round(rating);
        return (
            <>
                {"★".repeat(full)}
                {"☆".repeat(5 - full)}
            </>
        );
    };

    const handleDelete = () => {
        setExistingComment(false);
        setVerifiedComments(prev =>
            prev.filter(c => c.userId !== Number(userId))
        );
    };

    const handleUpdate = (updated: CommentProfessor) => {
        setVerifiedComments(prev =>
            prev.map(c => (c.userId === updated.userId ? updated : c))
        );
    };

    return (
        <div className="professor-card">
            <img
                className="professor-card__image"
                src={prof.imageUrl || "/default-profile-image.png"}
            />

            <h2
                className="professor-card__name"
                onClick={() => navigate(`/professor/${profId}`)}
            >
                {prof.firstName} {prof.lastName}
            </h2>

            <p className="professor-card__rating">
                Ocjena:{" "}
                {verifiedComments.length > 0 ? (
                    <>
                        <span className="professor-card__rating-stars">
                            {renderRatingStars(averageRating)}
                        </span>
                        <span className="professor-card__rating-number">
                            ({averageRating.toFixed(2)})
                        </span>
                    </>
                ) : (
                    "Nema ocjena"
                )}
            </p>

            {showDetails && (
                <div className="professor-card__details">
                    <p>Uže područje interesa: {prof.specialization}</p>
                    <p>Obrazovanje: {prof.education}</p>
                    <p>Email: {prof.email}</p>

                    <h4 className="professor-card__subjects-title">Predmeti:</h4>
                    <ul className="professor-card__subjects-list">
                        {prof.subjects?.length ? (
                            prof.subjects.map(s => (
                                <li
                                    key={s.id}
                                    className="professor-card__subject-item"
                                    onClick={() => navigate(`/subject/${s.id}`)}
                                >
                                    {s.title}
                                </li>
                            ))
                        ) : (
                            <li>Nema dodanih predmeta</li>
                        )}
                    </ul>
                </div>
            )}

            <div className="professor-card__actions">
                {!existingComment && (
                    <button
                        className="professor-card__btn professor-card__btn--add"
                        disabled={!rawToken || !userId}
                        onClick={() => setIsOpenAdd(true)}
                    >
                        Dodaj komentar
                    </button>
                )}

                {existingComment && (
                    <>
                        <button
                            className="professor-card__btn professor-card__btn--delete"
                            onClick={() => setIsOpenDelete(true)}
                        >
                            Izbriši komentar
                        </button>

                        <button
                            className="professor-card__btn professor-card__btn--update"
                            onClick={() => setIsOpenUpdate(true)}
                        >
                            Izmjeni komentar
                        </button>
                    </>
                )}
            </div>

            <AddProfessorCommentPopup
                isOpen={isOpenAdd}
                onClose={() => setIsOpenAdd(false)}
                id={profId}
                onSuccess={() => setExistingComment(true)}
            />

            <DeleteProfessorCommentPopup
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                id={profId}
                onSuccess={handleDelete}
            />

            <UpdateProfessorCommentPopup
                isOpen={isOpenUpdate}
                onClose={() => setIsOpenUpdate(false)}
                id={profId}
                onSuccess={handleUpdate}
            />

            <div className="professor-card__comments-toggle">
                <button onClick={() => setShowVerifiedComments(p => !p)}>
                    {showVerifiedComments ? "Sakrij komentare" : "Prikaži komentare"}
                </button>
            </div>

            {showVerifiedComments && (
                <div className="professor-card__comments-list">
                    {verifiedComments.map(c => (
                        <CPCardNormal key={c.id} comment={c} show />
                    ))}
                </div>
            )}
        </div>
    );
};
