import { useNavigate } from 'react-router-dom';
import {tokenIsExpired, tokenIsAdmin, get24Professors, get24Subjects} from '../services';
import { useAuth } from "../hooks";
import { routes } from '../constants/routes';
import { useEffect, useState } from 'react';
import { ShowUnverifiedProfComments } from '../components/UnverifiedProfessorComments';
import '../index.css';
import {getAllVerifiedUsersApi, getUnverifiedUsersApi} from "../services";

export const AdminSettingsPage = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const expired = token ? tokenIsExpired(token) : true;
    const [CommentsProf, setCommentsProf] = useState(false);
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
    };

    const getAllPosts = async() => {
        setContentTitle('All Posts');
        setContentParagraph('List of all posts will be displayed here.');
        console.log('Fetching all posts...');
    };

    const getAllProfessorComments = async () => {
        const response=await get24Professors(token);
        console.log('Professors:', response);
        setContentTitle('All Comments');
        setContentParagraph('List of all unverified professor comments will be displayed here.');
        setCommentsProf(!CommentsProf);
    };

    const getAllSubjectComments = async() => {
        const response=await get24Subjects(token);
        console.log('Subjects:', response);
        setContentTitle('All Comments');
        setContentParagraph('List of all subject comments will be displayed here.');
    };

    const getAllMaterials = async() => {
        setContentTitle('All Materials');
        setContentParagraph('List of all materials will be displayed here.');
    };

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
                    <ShowUnverifiedProfComments show = {CommentsProf}/>
                </section>
             </div>
        </div>
       );
};


