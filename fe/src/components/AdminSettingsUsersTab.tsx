import { useEffect, useState } from "react";
import {
    updateToken,
    getAllUsersApi, unverifyUserApi, verifyUserApi, deleteUserApi
} from "../services";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import '../index.css';
import {AdminUserViewProfile} from "../components";

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
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
        if(!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        const res=await deleteUserApi(userId,token)
        if(res?.status===200){
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
            alert('User deleted successfully.');
        }
    }

    const handleViewProfile = async (user: User) => {
        token= await updateToken(token!, login, logout, navigate, []);
        setIsVisible(true)
        setSelectedUser(user);
    }

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="admin-users-container">
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
                        onClick={() => handleViewProfile(user)}
                    >
                        View Profile
                    </button>
                </div>
            ))}
            <AdminUserViewProfile
                open={isVisible}
                user={selectedUser}
                close={() => {
                    setIsVisible(false);
                    setSelectedUser(null);
                }}/>
            {users.length === 0 && <p>No users to display.</p>}
        </div>
    );

};
//triba napravit da kad se delete user da se deleteaju i svi njegovi komentari, tokeni sve vezano uz njega
