import {useEffect,useState} from "react";
import {getAllVerifiedUsersApi, getUnverifiedUsersApi, updateToken,unverifyUserApi,verifyUserApi} from "../services";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";
import '../index.css'

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

export const AdminUsersCard = ({showVerified}: { showVerified: boolean }) => {
    const navigate = useNavigate();
    let { token,login,logout } = useAuth();
    const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);
    const [verifiedUsers, setVerifiedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       const fetchUsers = async () => {
              token = await updateToken(token!, login, logout, navigate, []);
              if (showVerified) {
                    if(verifiedUsers.length > 0) return;
                    const res = await getAllVerifiedUsersApi(token);
                    if (res?.status === 200) {
                        setVerifiedUsers(res.data);
                    }

              }else{
                    if(unverifiedUsers.length > 0) return;
                    const res = await getUnverifiedUsersApi(token);
                    if (res?.status === 200) {
                        setUnverifiedUsers(res.data);
                    }
              }
       }
         void fetchUsers().then(() => setLoading(false));
    }, [showVerified]);

    const handleToggleVerify = async (userId: number) => {
        token = await updateToken(token!, login, logout, navigate, []);

        if (showVerified) {
            const res = await unverifyUserApi(userId, token);
            console.log(res?.status);
            if (res?.status===200) {
                setVerifiedUsers(prev => prev.filter(u => u.id !== userId));
            }
        } else {
            const res = await verifyUserApi(userId, token);
            if (res?.status===200) {
                setUnverifiedUsers(prev => prev.filter(u => u.id !== userId));
            }
        }
    };


    if (loading) return <p>Loading users...</p>;

    return (
        <div className="admin-users-container">
            {(showVerified ? verifiedUsers : unverifiedUsers).map((user) => (
                <div key={user.id} className="admin-card">
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p>Email: {user.email}</p>
                    <p>User ID: {user.id}</p>

                    <button
                        className={showVerified ? "unverify-btn" : "verify-btn"}
                        onClick={() => handleToggleVerify(user.id)}
                    >
                        {showVerified ? "Unverify" : "Verify"}
                    </button>
                </div>

            ))}
        </div>
    );

}