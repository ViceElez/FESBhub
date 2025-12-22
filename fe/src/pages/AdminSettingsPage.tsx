import { useNavigate } from 'react-router-dom';
import {tokenIsExpired, tokenIsAdmin, get24Professors, get24Subjects, updateToken} from '../services';
import { useAuth } from "../hooks";
import { routes } from '../constants/routes';
import { useEffect, useState } from 'react';
import { ShowUnverifiedProfComments } from '../components';
import '../index.css';
import {getAllVerifiedUsersApi, getUnverifiedUsersApi} from "../services";
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

    const getAllProfessorComments = async () => {
        token = await updateToken(token!, login, logout, navigate, []);
        const response=await get24Professors(token);
        console.log('Professors:', response);
    };

    const getAllSubjectComments = async() => {
        token = await updateToken(token!, login, logout, navigate, []);
        const response=await get24Subjects(token);
        console.log('Subjects:', response);
    };

    const getAllMaterials = async() => {
        token = await updateToken(token!, login, logout, navigate, []);
    };

    useEffect(() => {
        async function checkAdmin() {
            token = await updateToken(token!, login, logout, navigate, []);
            console.log('Checking admin status with token:', token);
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
                        onClick={() => setActiveView('users')}>
                        All Users
                    </button>

                    <button
                        onClick={() => setActiveView('posts')}>
                        All Posts
                    </button>
                    <button
                        onClick={() => setActiveView('profComments')}>
                        All Professor Comments
                    </button>
                    <button
                        onClick={() => setActiveView('subComments')}>
                        All Subject Comments
                    </button>
                    <button
                        onClick={() => setActiveView('materials')}>
                        All Materials
                    </button>
                </section>
              
                <section className="admin-settings-content">
                    {activeView === 'users' && <AdminUsersCard />}
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


