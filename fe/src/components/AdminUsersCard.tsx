import {useEffect,useState} from "react";
import {getAllVerifiedUsersApi, getUnverifiedUsersApi, updateToken} from "../services";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

export const AdminUsersCard = () => {
    const navigate = useNavigate();
    let { token,login,logout } = useAuth();
    const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);
    const [verifiedUsers, setVerifiedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                token = await updateToken(token!, login, logout, navigate, []);
                const unverified = await getUnverifiedUsersApi(token);
                const verified = await getAllVerifiedUsersApi(token);

                setUnverifiedUsers(unverified);
                setVerifiedUsers(verified);
            } finally {
                setLoading(false);
            }
        }
        void fetchUsers();
    }, []);

    if (loading) return <p>Loading users...</p>;

    return (
        <div>
            <h3>Unverified Users:</h3>
            {unverifiedUsers.map(u => (
                <div key={u.id}>
                    <p>{u.firstName}</p>
                    <p>{u.lastName}</p>
                    <p>{u.email}</p>
                </div>
            ))}

            <h3>Verified Users:</h3>
            {verifiedUsers.map(u => (
                <div key={u.id}>
                    <p>{u.firstName}</p>
                    <p>{u.lastName}</p>
                    <p>{u.email}</p>
                </div>
            ))}
        </div>
    );
}