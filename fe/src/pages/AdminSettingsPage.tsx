import { useNavigate } from 'react-router-dom';
import { tokenIsExpired, tokenIsAdmin } from '../services';
import { useAuth } from "../hooks";
import { routes } from '../constants/routes';
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

export const AdminSettingsPage = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const expired = token ? tokenIsExpired(token) : true;
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [adminLoaded, setAdminLoaded] = useState<boolean>(false);

    useEffect(() => {
        async function checkAdmin() {
            if (!token) {
                setIsAdmin(false);
                setAdminLoaded(true);
                return;
            }

            const result = await tokenIsAdmin(token);
            setIsAdmin(result);
            setAdminLoaded(true);
        }
        void checkAdmin();
    }, [token]);

    if (!token) {
        return (
            <div>
                <h1>Admin Settings</h1>
                <p>You must be logged in to access admin settings.</p>
                <button onClick={() => navigate(routes.LOGIN)}>Go to Login</button>
            </div>
        );
    }

    if (expired) {
        return (
            <div>
                <h1>Admin Settings</h1>
                <p>Your session has expired. Please log in again.</p>
                <button onClick={() => navigate(routes.LOGIN)}>Login</button>
            </div>
        );
    }

    if (!adminLoaded) {
        return <p>Loading...</p>;
    }

    if (!isAdmin) {
        return (
            <div>
                <h1>Admin Settings</h1>
                <p>You do not have admin privileges.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Admin Settings</h1>
            <p>Welcome, Admin!</p>

            <Link to={routes.NEWSPAGE}>
                <button>Go to News Page</button>
            </Link>
        </div>
    );
};