import { useNavigate } from 'react-router-dom';
import {tokenIsExpired, tokenIsAdmin, updateToken} from '../services';
import { useAuth } from "../hooks";
import { routes } from '../constants/routes';
import { useEffect, useState } from 'react';
import {AdminProfessorCommentsCard, ShowUnverifiedProfComments} from '../components';
import '../index.css';
import { AdminUsersCard } from '../components';

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
    const [CommentsProf, setCommentsProf] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoaded, setAdminLoaded] = useState(false);
    const[activeView,setActiveView]=useState<AdminView>(null);

    const setUsersView =async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setActiveView('users');
    }

    const setPostsView =async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setActiveView('posts');
    }

    const setProfCommentsView =async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setActiveView('profComments');
    }
    const setSubCommentsView =async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setActiveView('subComments');
    }

    const setMaterialsView =async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setActiveView('materials');
    }

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
                        onClick={setUsersView}>
                        All Users
                    </button>

                    <button
                        onClick={setPostsView}>
                        All Posts
                    </button>
                    <button
                        onClick={setProfCommentsView}>
                        All Professor Comments
                    </button>
                    <button
                        onClick={setSubCommentsView}>
                        All Subject Comments
                    </button>
                    <button
                        onClick={setMaterialsView}>
                        All Materials
                    </button>
                </section>
              
                <section className="admin-settings-content">
                    {activeView === 'users' && <AdminUsersCard />}
                    {activeView === 'posts' && <AdminProfessorCommentsCard/>}
                    {activeView === 'profComments' && <div><p>All Professor Comments Component Placeholder</p></div>}
                    {activeView === 'subComments' && <div><p>All Subject Comments Component Placeholder</p></div>}
                    {activeView === 'materials' && <div><p>All Materials Component Placeholder</p></div>}
                </section>
             </div>
            <button
                onClick = {() => setCommentsProf(!CommentsProf)}
            >
                Professor Comments
            </button>
            <ShowUnverifiedProfComments show = {CommentsProf}/>
        </div>
       );
};


