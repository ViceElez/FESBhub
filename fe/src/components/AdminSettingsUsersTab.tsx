import { useEffect, useState } from "react";
import {
    updateToken,
    getAllUsersApi, unverifyUserApi, verifyUserApi, deleteUserApi, getUsersByName
} from "../services";
import { useAuth, useDebounce } from "../hooks";
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
    const [shownUsers, setShownUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm);

    useEffect(() => {
        const fetchSearchedUsers = async () => {
            if (!debouncedSearchTerm) {
                setLoading(true)
                try{
                    token=await updateToken(token!, login, logout, navigate, []);
                    const res=await getAllUsersApi(token);
                    if(res?.status===200){
                        const allUsers: User[] = res.data;
                        setUsers(allUsers);
                        setShownUsers(allUsers);
                    }
                }catch (e){
                    console.log(e)
                    return
                }finally {
                    setLoading(false)
                }
                return;
            }

            setLoading(true);
            try {
                token = await updateToken(token!, login, logout, navigate, []);
                const res = await getUsersByName(debouncedSearchTerm,token);
                if (res?.status === 200) {
                    const searchedUsers: User[] = res.data;
                    setShownUsers(searchedUsers);
                } else {
                    setShownUsers([]);
                }
            } catch (err) {
                console.error(err);
                setShownUsers([]);
            } finally {
                setLoading(false);
            }
        }
        void fetchSearchedUsers();
    }, [debouncedSearchTerm]);

    const handleToggleVerify = async (userId: number) => {
        token = await updateToken(token!, login, logout, navigate, []);
        const user = users.find(u => u.id === userId);
        if (!user) return;
        if(user.isVerified){
            const res=await unverifyUserApi(userId, token);
            console.log(res);
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

    return (
        <div>
            <div className="user-search-wrapper">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="user-search-input"
                />
            </div>

            <div className="admin-users-container">
                {loading && <p className="loading-text">Loading users...</p>}
                {!loading && shownUsers.map(user => (
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
                        <p className="admin-card-created">
                            Account Created At:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>

                        <button
                            className={user.isVerified ? "unverify-btn" : "verify-btn"}
                            onClick={() => handleToggleVerify(user.id)}
                        >
                            {user.isVerified ? "Unverify" : "Verify"}
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

                {!loading && shownUsers.length === 0 && (
                    <p>No users to display.</p>
                )}
            </div>

            <AdminUserViewProfile
                open={isVisible}
                user={selectedUser}
                close={() => {
                    setIsVisible(false);
                    setSelectedUser(null);
                }}
            />
        </div>

    );

};
//triba napravit da kad se delete user da se deleteaju i svi njegovi komentari, tokeni sve vezano uz njega
