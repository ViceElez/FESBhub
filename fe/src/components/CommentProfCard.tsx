import { useEffect, useState } from "react";
import type { CommentProfessorNormal } from "../constants";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { getUserById,updateToken } from "../services";

export const CPCardNormal = ({ comment, show }: CommentProfessorNormal) => {
    const [userFirstName, setUserFirstName] = useState<string>("");
    const [userLastName, setUserLastName] = useState<string>("");

    let { token, login, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res = await getUserById(comment.userId, token!);
            if (res?.status === 200) {
                setUserFirstName(res.data.firstName);
                setUserLastName(res.data.lastName);
            }
        };
        void fetchUser();
    }, [comment.userId, token]);

    if (comment.verified === false || !show) {
        return null;
    }

    return (
        <div className="professor-comment-card">
            <h4 className="professor-comment-card__author">
                {userFirstName} {userLastName} je komentirao:
            </h4>

            <p className="professor-comment-card__rating" >
                Ocjena: <span>{comment.rating.toFixed(2)}</span>
            </p>

            <p className="professor-comment-card__content">
                {comment.content}
            </p>
        </div>
    );
};


