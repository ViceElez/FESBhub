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

    if (loading) return <p>Loading users...</p>;

    return (
        <div>
            {(showVerified ? verifiedUsers : unverifiedUsers).map((user) => (
                <div key={user.id} className="admin-card">
                    {showVerified?(
                        <div>
                            <h3>{user.firstName} {user.lastName}</h3>
                            <p>Email: {user.email}</p>
                            <p>User ID: {user.id}</p>
                        </div>
                    ):(
                        <div>
                            <h3>{user.firstName} {user.lastName}</h3>
                            <p>Email: {user.email}</p>
                            <p>User ID: {user.id}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}