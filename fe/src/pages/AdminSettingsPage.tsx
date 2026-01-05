import { useNavigate } from 'react-router-dom';
import {tokenIsExpired, tokenIsAdmin} from '../services';
import { useAuth } from "../hooks";
import { routes } from '../constants';
import { useEffect, useState } from 'react';
import '../index.css';
import {updateToken} from "../services";
import {
    AdminSettingsPostsTab,
    AdminSettingsUsersTab,
    AdminSettingsMaterialsTab,
    AdminSettingsSubjectTab,
    AdminSettingsProfessorTab,
    AdminSettingsVerifyContentTab,
} from '../components';

type AdminView =
    | 'users'
    | 'posts'
    | 'professors'
    | 'subjects'
    | 'materials'
    | 'verify'
    | null;

export const AdminSettingsPage = () => {
    const navigate = useNavigate();
    let { token,login,logout } = useAuth();
    const expired = token ? tokenIsExpired(token) : true;
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoaded, setAdminLoaded] = useState(false);
    const [adminView, setAdminView] = useState<AdminView>(null);

    useEffect(() => {
        async function checkAdmin() {
            token = await updateToken(token!, login, logout, navigate, []);
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

    const setUserView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setAdminView('users');
    }

    const setPostView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setAdminView('posts');
    }

    const setProfessorView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setAdminView('professors');
    }

    const setSubjectView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setAdminView('subjects');
    }

    const setMaterialView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setAdminView('materials');
    }

    const setVerifyView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setAdminView('verify');
    }

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
        <div className="admin-settings-container">
            <div className="admin-settings-header">
                <h2>Welcome to the Admin Settings Page</h2>
                <p>Select an option from above to manage users, posts, comments, or materials.</p>
            </div>

            <div className="admin-settings-body">
                <section className="admin-settings-buttons">
                    <button
                        onClick={setUserView}>
                        All Users
                    </button>
                    <button
                        onClick={setPostView}>
                        All Posts
                    </button>
                    <button
                        onClick={setProfessorView}>
                        All Professors
                    </button>
                    <button
                        onClick={setSubjectView}>
                        All Subjects
                    </button>
                    <button
                        onClick={setMaterialView}>
                        All Materials
                    </button>
                    <button
                        onClick={setVerifyView}
                    >
                        Verify
                    </button>
                </section>

                <section className="admin-settings-content">
                    <div>
                        {adminView === 'users' && (
                            <AdminSettingsUsersTab/>
                        )}

                        {adminView === 'posts' && (
                            <AdminSettingsPostsTab/>
                        )}
                        {adminView === 'professors' && (
                            <AdminSettingsProfessorTab/>
                        )}
                        {adminView === 'subjects' && (
                            <AdminSettingsSubjectTab/>
                        )}
                        {adminView === 'materials' && (
                            <AdminSettingsMaterialsTab/>
                        )}
                        {adminView === 'verify' && (
                            <AdminSettingsVerifyContentTab/>
                        )}
                    </div>
                </section>
             </div>
        </div>
       );
};


