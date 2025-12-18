// typescript
import { useNavigate } from 'react-router-dom';
import { tokenIsExpired, tokenIsAdmin } from '../services';
import { useAuth } from "../hooks";
import { routes } from '../constants/routes';
import { useEffect, useState } from 'react';
import '../index.css';

export const AdminSettingsPage = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const expired = token ? tokenIsExpired(token) : true;
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoaded, setAdminLoaded] = useState(false);

    const [contentTitle, setContentTitle] = useState<string>('');
    const [contentParagraph, setContentParagraph] = useState<string>('');

    const getAllUsers = () => {
        setContentTitle('All Users');
        setContentParagraph('List of all users will be displayed here.');
        console.log('Fetching all users...');
    };
    const getAllPosts = () => {
        setContentTitle('All Posts');
        setContentParagraph('List of all posts will be displayed here.');
        console.log('Fetching all posts...');
    };
    const getAllComments = () => {
        setContentTitle('All Comments');
        setContentParagraph('List of all comments will be displayed here.');
        console.log('Fetching all comments...');
    };
    const getAllMaterials = () => {
        setContentTitle('All Materials');
        setContentParagraph('List of all materials will be displayed here.');
        console.log('Fetching all materials...');
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
                    <button onClick={getAllComments}>All Comments</button>
                    <button onClick={getAllMaterials}>All Materials</button>
                </section>

                <section className="admin-settings-content">
                    <h3 id="admin-content-title">{contentTitle}</h3>
                    <p id="admin-content-paragraph">{contentParagraph}</p>
                </section>
            </div>
        </div>
    );
};
