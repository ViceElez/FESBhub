import { useNavigate } from 'react-router-dom';
import {tokenIsExpired, tokenIsAdmin} from '../services';
import { useAuth } from "../hooks";
import { routes } from '../constants';
import { useEffect, useState } from 'react';
import '../index.css';
import {updateToken} from "../services";
import {
    AdminMaterialsCard,
    AdminPostsCard,
    AdminUsersCard,
    ShowAdminSubjComments,
    ShowUnverifiedProfComments
} from '../components';

type AdminView =
    | 'users'
    | 'posts'
    | 'profComments'
    | 'subComments'
    | 'materials'
    | null;

export const AdminSettingsPage = () => {
    const navigate = useNavigate();
    let { token,login,logout } = useAuth();
    const expired = token ? tokenIsExpired(token) : true;
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoaded, setAdminLoaded] = useState(false);
    const [adminView, setAdminView] = useState<AdminView>(null);
    const [showVerified, setShowVerified] = useState(false);

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

    const setProfCommentView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setAdminView('profComments');
    }

    const setSubCommentView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setAdminView('subComments');
    }

    const setMaterialView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setAdminView('materials');
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
                        onClick={setProfCommentView}>
                        All Professor Comments
                    </button>
                    <button
                        onClick={setSubCommentView}>
                        All Subject Comments
                    </button>
                    <button
                        onClick={setMaterialView}>
                        All Materials
                    </button>
                </section>

                <section className="admin-settings-content">
                    <button onClick={() => setShowVerified(v => !v)}>
                        {showVerified ? 'Show Unverified' : 'Show Verified'}
                    </button>
                    <div>
                        {adminView === 'users' && (
                            <AdminUsersCard/>
                        )}

                        {adminView === 'posts' && (
                            <AdminPostsCard/>
                        )}
                        {adminView === 'profComments' && (
                            <ShowUnverifiedProfComments showVerified={showVerified} />
                        )}

                        {adminView === 'subComments' && (
                            <ShowAdminSubjComments showVerified={showVerified} />
                        )}
                        {adminView === 'materials' && (
                            <AdminMaterialsCard/>
                        )}
                    </div>
                </section>
             </div>
        </div>
       );
};


