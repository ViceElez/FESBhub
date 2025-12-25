import { useNavigate } from 'react-router-dom';
import {tokenIsExpired, tokenIsAdmin, getAllProfessors, getAllSubjects} from '../services';
import { useAuth } from "../hooks";
import { routes } from '../constants/routes';
import { useEffect, useState } from 'react';
import { ShowAdminProfComments } from '../components/UnverifiedProfessorComments';
import '../index.css';
import {getAllVerifiedUsersApi, getUnverifiedUsersApi} from "../services";
import { ShowAdminSubjComments } from '../components/UnverifiedSubjectComments';

export const AdminSettingsPage = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const expired = token ? tokenIsExpired(token) : true;
    const [CommentsProf, setCommentsProf] = useState(-1);
    const [CommentsSubj, setCommentsSubj] = useState(-1);
    const [Users, setUsers] = useState(-1);
    const [Posts, setPosts] = useState(-1);
    const [Materials, setMaterials] = useState(-1);
    const [showVerified, setShowVerified] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoaded, setAdminLoaded] = useState(false);

    const [contentTitle, setContentTitle] = useState<string>('');
    const [contentParagraph, setContentParagraph] = useState<string>('');

    const getAllUsers = async () => {
        const response=await getUnverifiedUsersApi(token);
        const response1=await getAllVerifiedUsersApi(token);
        console.log('Unverified Users:', response);
        console.log('Verified Users:', response1);
        setContentTitle('All Users');
        setContentParagraph('List of all users will be displayed here.');
        setCommentsProf(-1);
        setCommentsSubj(-1);
        setUsers(1);
        setPosts(-1);
        setMaterials(-1);
    };

    const getAllPosts = async() => {
        setContentTitle('All Posts');
        setContentParagraph('List of all posts will be displayed here.');
        console.log('Fetching all posts...');
        setCommentsProf(-1);
        setCommentsSubj(-1);
        setUsers(-1);
        setPosts(1);
        setMaterials(-1);
    };

    const getAllProfessorComments = async () => {
        const response=await getAllProfessors(token);
        setContentTitle('All Comments');
        setContentParagraph('');
        setCommentsProf(1);
        setCommentsSubj(-1);
        setUsers(-1);
        setPosts(-1);
        setMaterials(-1);
    };

    const getAllSubjectComments = async() => {
        const response=await getAllSubjects(token);
        setContentTitle('All Comments');
        setContentParagraph('');
        setCommentsProf(-1);
        setCommentsSubj(1);
        setUsers(-1);
        setPosts(-1);
        setMaterials(-1);
    };

    const getAllMaterials = async() => {
        setContentTitle('All Materials');
        setContentParagraph('List of all materials will be displayed here.');
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
                    <button onClick={getAllUsers}>All Users</button>
                    <button onClick={getAllPosts}>All Posts</button>
                    <button onClick={getAllProfessorComments}>All Professor Comments</button>
                    <button onClick={getAllSubjectComments}>All Subject Comments</button>
                    <button onClick={getAllMaterials}>All Materials</button>
                </section>
                
                <section className="admin-settings-content">
                    <h3 id="admin-content-title">{contentTitle}</h3>
                    <p id="admin-content-paragraph">{contentParagraph}</p>
                    <button
                        onClick={handleVerify}
                    >
                        {showVerified === 2 ? 'Show Verified' : 'Show Unverified'}
                    </button>
                    <div>
                        <ShowAdminProfComments show = {CommentsProf * showVerified}/>
                        <ShowAdminSubjComments show = {CommentsSubj * showVerified}/>
                    </div>
                </section>
             </div>
        </div>
       );
};


