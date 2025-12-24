import type { CommentSubjectNormal } from '../constants/CommentSubjectNormal';
import { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../services/userApi.ts";
import {updateToken} from "../services/updateToken.ts";

export const CSCardNormal = ({comment, show}: CommentSubjectNormal) => {
    const [userFirstName, setUserFirstName] = useState<string>("");
    const [userLastName, setUserLastName] = useState<string>("");
    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getUserById(comment.userId, token!);
            setUserFirstName(response.firstName);
            setUserLastName(response.lastName);
        };
        void fetchUser();
    }, [comment.userId, token]);

    if (comment.verified === false || !show) {
        return <div></div>;
    }

    return (
        <div style = {{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <div>
                <h4>{userFirstName} {userLastName} je komentirao:</h4>
                <h2>Ocjena tezine: {comment.ratingDifficulty}</h2>
                <h2>Ocjena korisnosti: {comment.ratingPracticality}</h2>
                <h2>Ocjena očekivanja: {comment.ratingExpectation}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
        </div>
    );
}

