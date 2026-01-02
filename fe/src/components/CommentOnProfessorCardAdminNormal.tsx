import { useEffect, useState } from "react";
import { verifyProfessorComment, deleteProfessorComment, updateToken, getUserById } from "../services";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import type { CommentProfessor } from "../constants";

export const CommentProfessorCardAdminSettings = (comment: CommentProfessor) => {
    const [userFirstName, setUserFirstName] = useState<string>("");
    const [userLastName, setUserLastName] = useState<string>("");
    const [deleted, setDeleted] = useState(false);
    const [verified, setVerified] = useState(comment.verified);

    const { token, login, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserById(comment.userId, token!);

            /*
            ko god da je radia stvari za usere nek popravi ovo kad stigne
            jer trenutno nepostoji response.status jer response nema data
            ni nista pa se svi atributi iz date samo nalaze u response
            npr: response.firstName izbaci Vatroslav
            potencijalni problem je sta response nemora bit dobar pa sve crasha
            ispod je primjer kako bi kod triba izgledat da response ima status i data
            */

            /* if (response.status === 200) {
                console.log("Fetched user successfully");
                setUserFirstName(response.data.firstName);
                setUserLastName(response.data.lastName);
            } */

            setUserFirstName(response.firstName);
            setUserLastName(response.lastName);
        };
        void fetchUser();
    }, [comment.userId, token]);

    if (deleted) return null;

    const handleVerify = async () => {
        const newToken = await updateToken(token!, login, logout, navigate, []);
        const res = await verifyProfessorComment(comment.profId, comment.userId, comment.rating, comment.content, newToken);
        if (res?.status === 200) setVerified(true);
    };

    const handleUnverify = async () => {
        console.log("Unverify not implemented yet");
    };

    const handleDelete = async () => {
        const newToken = await updateToken(token!, login, logout, navigate, []);
        const res = await deleteProfessorComment(comment.profId, newToken, comment.userId);
        if (res?.status === 200) setDeleted(true);
    };

    return (
        <div className="admin-card">
            <div className="admin-card-content">
                <h2>Korisnik: {userFirstName} {userLastName}</h2>
                <h4>ID korisnika: {comment.userId}</h4>
                <h2>Ocjena: {comment.rating}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
            <div className="admin-card-actions">
                {!verified && <button className="verify-btn" onClick={handleVerify}>Verify</button>}

                {verified && <button className="unverify-btn" onClick={handleUnverify}>Unverify</button>}

                <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};
