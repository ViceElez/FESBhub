import type { CommentProfessor } from "../constants";
import {useEffect, useState} from "react";
import {  deleteProfessorComment } from "../services/professorCommentsApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken } from "../services/updateToken.ts";
import { getUserById } from "../services/userApi.ts";


export const CPCardAdminNormal = (comment: CommentProfessor) => {
    const [userFirstName, setUserFirstName] = useState<string>("");
    const [userLastName, setUserLastName] = useState<string>("");
    const [deleted, setDeleted] = useState(false);

    let {token, login, logout} = useAuth();
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

    if (deleted === true) {
        return <div></div>;
    }

    const handleDelete = async () => {
        setDeleted(true);
        token = await updateToken(token!, login, logout, navigate, []);
        const response=await deleteProfessorComment(comment.profId,token, comment.userId)
        if(response?.status===200){
            alert('Success')
        }
        else {
            alert("Error")
            console.log(response)
        }
    }

    return (
        <div style = {{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <div>
                <h2>Korisnik: {userFirstName} {userLastName}</h2>
                <h4>ID korisnika: {comment.userId}</h4>
                <h2>Ocjena: {comment.rating}</h2>
                <h2>Komentar: {comment.content}</h2>
            </div>
            <button
            onClick = {handleDelete}
            >
                Izbriši
            </button>
        </div>
    );
};
