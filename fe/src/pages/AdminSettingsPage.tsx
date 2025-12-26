import { useNavigate } from 'react-router-dom';
import {tokenIsExpired, tokenIsAdmin, getAllProfessors, getAllSubjects} from '../services';
import { useAuth } from "../hooks";
import { routes } from '../constants';
import { useEffect, useState } from 'react';
import '../index.css';
import {getAllVerifiedUsersApi, getUnverifiedUsersApi,updateToken} from "../services";
import { ShowAdminSubjComments,ShowUnverifiedProfComments } from '../components';

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
    const [CommentsProf, setCommentsProf] = useState(-1);
    const [CommentsSubj, setCommentsSubj] = useState(-1);
    const [Users, setUsers] = useState(-1);
    const [Posts, setPosts] = useState(-1);
    const [Materials, setMaterials] = useState(-1);
    const [showVerified, setShowVerified] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoaded, setAdminLoaded] = useState(false);
    const [adminView, setAdminView] = useState<AdminView>(null);


    const setUserView = async () => {
        setAdminView('users');
        // setCommentsProf(-1);
        // setCommentsSubj(-1);
        // setUsers(1);
        // setPosts(-1);
        // setMaterials(-1);
    };

    const setPostView = async() => {
        console.log('Fetching all posts...');
        setCommentsProf(-1);
        setCommentsSubj(-1);
        setUsers(-1);
        setPosts(1);
        setMaterials(-1);
    };

    const setProfCommentsView = async () => {
        const response=await getAllProfessors(token);
        setCommentsProf(1);
        setCommentsSubj(-1);
        setUsers(-1);
        setPosts(-1);
        setMaterials(-1);
    };

    const setSubjCommentsView = async() => {
        const response=await getAllSubjects(token);
        setCommentsProf(-1);
        setCommentsSubj(1);
        setUsers(-1);
        setPosts(-1);
        setMaterials(-1);
    };

    const setMaterialView = async() => {
        setCommentsProf(-1);
        setCommentsSubj(-1);
        setUsers(-1);
        setPosts(-1);
        setMaterials(1);
    };

    const handleVerify = () => {
        if(showVerified === 1){
            setShowVerified(2);
        }
        else{
            setShowVerified(1);
        }
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
                        onClick={setUserView}>
                        All Users
                    </button>

                    <button
                        onClick={setPostView}>
                        All Posts
                    </button>
                    <button
                        onClick={setProfCommentsView}>
                        All Professor Comments
                    </button>
                    <button
                        onClick={setSubjCommentsView}>
                        All Subject Comments
                    </button>
                    <button
                        onClick={setMaterialView}>
                        All Materials
                    </button>
                </section>
                
                <section className="admin-settings-content">
                    <button
                        onClick={handleVerify}
                    >
                        {showVerified === 2 ? 'Show Verified' : 'Show Unverified'}
                    </button>
                    <div>
                        <ShowUnverifiedProfComments show = {CommentsProf * showVerified}/>
                        <ShowAdminSubjComments show = {CommentsSubj * showVerified}/>
                    </div>
                </section>
             </div>
        </div>
       );
};


