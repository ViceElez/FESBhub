import { useEffect, useState } from "react";
import type { CommentProfessorNormal } from "../constants";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { getUserById,updateToken } from "../services";

export const CPCardNormal = ({comment, show}: CommentProfessorNormal) => {

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
        <div className = "card-scroll-horizontally card" >
            <div>
                <h4>{userFirstName} {userLastName} je komentirao:</h4>
                <h2>Ocjena: {comment.rating.toFixed(2)}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
        </div>
    );
}

