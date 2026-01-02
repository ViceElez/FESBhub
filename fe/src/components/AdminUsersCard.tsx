import { useEffect, useState } from "react";
import { getAllVerifiedUsersApi, getUnverifiedUsersApi, updateToken, verifyUserApi, unverifyUserApi } from "../services";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import '../index.css';

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

export const AdminUsersCard = () => {
    const navigate = useNavigate();
    let { token, login, logout } = useAuth();

    const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);
    const [verifiedUsers, setVerifiedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'unverified' | 'verified'>('unverified');
    const showVerified = activeTab === 'verified';

    useEffect(() => {
        const fetchUsers = async () => {
            token = await updateToken(token!, login, logout, navigate, []);

            if (showVerified) {
                if (verifiedUsers.length > 0) return;
                const res = await getAllVerifiedUsersApi(token);
                if (res?.status === 200) setVerifiedUsers(res.data);
            } else {
                if (unverifiedUsers.length > 0) return;
                const res = await getUnverifiedUsersApi(token);
                if (res?.status === 200) setUnverifiedUsers(res.data);
            }
        };

        setLoading(true);
        void fetchUsers().then(() => setLoading(false));
    }, [activeTab]);


    const handleToggleVerify = async (userId: number) => {
        token = await updateToken(token!, login, logout, navigate, []);

        if (showVerified) {
            const res = await unverifyUserApi(userId, token);
            if (res?.status===200) setVerifiedUsers(prev => prev.filter(u => u.id !== userId));
        } else {
            const res = await verifyUserApi(userId, token);
            if (res?.status===200) setUnverifiedUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    if (loading) return <p>Loading users...</p>;

    const usersToShow = showVerified ? verifiedUsers : unverifiedUsers;

    return (
        <div>
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'unverified' ? 'active' : ''}`}
                    onClick={() => setActiveTab('unverified')}
                >
                    Unverified Users
                </button>

                <button
                    className={`admin-tab ${activeTab === 'verified' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verified')}
                >
                    Verified Users
                </button>
            </div>
            <div className="admin-users-container">
                {usersToShow.map(user => (
                    <div key={user.id} className="admin-card">
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p>Email: {user.email}</p>
                        <p>User ID: {user.id}</p>

                        <button
                            className={showVerified ? 'unverify-btn' : 'verify-btn'}
                            onClick={() => handleToggleVerify(user.id)}
                        >
                            {showVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button>
                            Delete
                        </button>
                        <button>
                            View Profile
                        </button>
                    </div>
                ))}

                {usersToShow.length === 0 && <p>No users to display.</p>}
            </div>
        </div>
    );
};
//znaci triba dizajn risit da je sve isto, i da nie puno css fileova,l za usera napravit delete i za sad view profile je samo button bez funkcionalnosti, ist otako ce tribat napravit ove kartice od vaatre ne u 500 fileova
