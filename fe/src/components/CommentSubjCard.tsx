import type { CommentSubjectNormal } from '../constants';
import { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { getUserById,updateToken } from "../services";

export const CSCardNormal = ({comment, show}: CommentSubjectNormal) => {
    const [userFirstName, setUserFirstName] = useState<string>("");
    const [userLastName, setUserLastName] = useState<string>("");
    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res = await getUserById(comment.userId, token!);
            if(res?.status===200){
                setUserFirstName(res.data.firstName);
                setUserLastName(res.data.lastName);
            }
        };
        void fetchUser();
    }, [comment.userId, token]);

    if (!comment.verified || !show) {
        return <div></div>;
    }

    return (
        <div className="card-scroll-horizontally card"
        >
            <div>
                <h4>{userFirstName} {userLastName} je komentirao:</h4>
                <h2>Ocjena tezine: {comment.ratingDifficulty.toFixed(2)}</h2>
                <h2>Ocjena korisnosti: {comment.ratingPracticality.toFixed(2)}</h2>
                <h2>Ocjena očekivanja: {comment.ratingExpectation.toFixed(2)}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
        </div>
    );
}

