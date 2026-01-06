import { useEffect, useState } from "react";
import { verifyProfessorComment, deleteProfessorComment, updateToken, getUserById } from "../services";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import type { CommentProfessor } from "../constants";
import '../index.css';

type CommentProfessorCardAdminSettingsProps = {
    comment: CommentProfessor;
    onRemove: (id: number) => void;
}

export const CommentProfessorCardAdminSettings = ({comment,onRemove}:CommentProfessorCardAdminSettingsProps) => {
    const [userFirstName, setUserFirstName] = useState<string>("");
    const [userLastName, setUserLastName] = useState<string>("");

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

    const handleVerify = async () => {
        const newToken = await updateToken(token!, login, logout, navigate, []);
        const res = await verifyProfessorComment(comment.profId, comment.userId, comment.rating, comment.content, newToken);
        if (res?.status === 200) {
            alert("Comment verified successfully ");
            onRemove(comment.id);
        }
        else{
            alert("Error verifying comment");
        }
    };

    const handleDelete = async () => {
        const newToken = await updateToken(token!, login, logout, navigate, []);
        if(!confirm('Are you sure you want to delete this comment?')) {
            return;
        }
        const res = await deleteProfessorComment(comment.profId, newToken, comment.userId);
        if (res?.status === 200){
            alert("Comment deleted successfully");
            onRemove(comment.id);
        }
        else{
            alert("Error deleting comment");
        }
    };

    return (
        <div className="comment-card">
            <div className="comment-content">
                <h2>Korisnik: {userFirstName} {userLastName}</h2>
                <h4>ID korisnika: {comment.userId}</h4>
                <h3>Ocjena: {comment.rating}</h3>
                <p>{comment.content}</p>
            </div>

            <div className="comment-actions">
                <button className="verify-btn" onClick={handleVerify}>Verify</button>
                <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );

};
