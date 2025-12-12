import axios from "axios";
import {useState, useEffect} from "react";

export const CheckIfCommentExists = (profId: number, userId: Number, token: string) => {
    const [exists, setExists] = useState<boolean>(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/comment-prof/exists?profId=${profId}&userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        setExists(!response.data);
    })});
    return exists
};

