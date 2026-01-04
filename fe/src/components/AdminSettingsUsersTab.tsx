import { useEffect, useState } from "react";
import {
    updateToken,
    getAllUsersApi, unverifyUserApi, verifyUserApi
} from "../services";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import '../index.css';

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    studij: string;
    currentStudyYear: number;
    createdAt: string;
    isVerified: boolean;
};

export const AdminSettingsUsersTab = () => {
    const navigate = useNavigate();
    let { token, login, logout } = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res=await getAllUsersApi(token);
            if(res?.status===200){
                const allUsers: User[] = res.data;
                setUsers(allUsers);
            }
        };
        setLoading(true);
        void fetchUsers().then(() => setLoading(false));
    },[]);


    const handleToggleVerify = async (userId: number) => {
        token = await updateToken(token!, login, logout, navigate, []);
        const user = users.find(u => u.id === userId);
        if (!user) return;
        if(user.isVerified){
            const res=await unverifyUserApi(userId, token);
            if(res?.status===200){
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.id === userId ? { ...u, isVerified: false } : u
                    )
                );
            }
        }
        else{
            const res=await verifyUserApi(userId, token);
            if(res?.status===200){
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.id === userId ? { ...u, isVerified: true } : u
                    )
                );
            }
        }

    };

    const handleDelete = async (userId: number) => {
        token= await updateToken(token!, login, logout, navigate, []);
        console.log("Delete called for userId:", userId);
    }

    const handleViewProfile = async (userId: number) => {
        token= await updateToken(token!, login, logout, navigate, []);
        console.log("View Profile called for userId:", userId);
    }

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="admin-users-container">
            <h2>All Users</h2>
            {users.map(user => (
                <div key={user.id} className="admin-card">
                    <h2 className="admin-card-name">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="admin-card-email">Email: {user.email}</p>
                    <p className="admin-card-studij">
                        Study Program: {user.studij ?? "None"}
                    </p>
                    <p className="admin-card-year">
                        Current Study Year: {user.currentStudyYear ?? "None"}
                    </p>
                    <p className="admin-card-created">Account Created At: {new Date(user.createdAt).toLocaleDateString()}</p>

                    <button
                        className={user.isVerified ? 'unverify-btn' : 'verify-btn'}
                        onClick={() => handleToggleVerify(user.id)}
                    >
                        {user.isVerified ? 'Unverify' : 'Verify'}
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                    >
                        Delete
                    </button>

                    <button
                        className="view-profile-btn"
                        onClick={() => handleViewProfile(user.id)}
                    >
                        View Profile
                    </button>
                </div>
            ))}

            {users.length === 0 && <p>No users to display.</p>}
        </div>
    );

};
//znaci triba dizajn risit da je sve isto, i da nie puno css fileova,l za usera napravit delete i za sad view profile je samo button bez funkcionalnosti, ist otako ce tribat napravit ove kartice od vaatre ne u 500 fileova
