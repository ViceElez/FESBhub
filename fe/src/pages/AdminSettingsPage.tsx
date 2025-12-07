import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenIsExpired,tokenIsAdmin } from '../services';
import {useAuth} from "../hooks";
import {routes} from '../constants/routes';

export const AdminSettingsPage = () => {
    const [title, setTitle] = useState('this is the title');
    const [content, setContent] = useState('this is the content');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate(); // hook za navigaciju glupu
    const {token}=useAuth()
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

    async function handleSubmit(e: React.FormEvent) { //.formevent guess so
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

           if (!res.ok) {
                // bas kad nemoze fetchat
                if (res.status === 401 || res.status === 403) {
                    // prebacujem na login al mozda neki error 
                    navigate(routes.LOGIN);
                   // setMessage('You are not authorized. Please login.');
                    return;
                }

                const ct = res.headers.get('content-type') ?? '';
                let body: any = null;
                if (ct.includes('application/json')) {
                    body = await res.json().catch(() => null);
                } else {
                    const text = await res.text().catch(() => '');
                    body = { message: text };
                }

                setMessage(`Error ${res.status}: ${body?.message ?? res.statusText}`);
            } else {
                // success
                if (res.status === 204) {
                    setMessage('Operation succeeded.');
                } else {
                    const data = await res.json().catch(() => null);
                    setMessage('Post created successfully');
                    setTitle('');
                    setContent('');
                    console.log('Created post', data);
                }
            }
        } catch (err: any) {
            setMessage(err?.message ?? 'Network error');
        } finally {
            setLoading(false);
        }
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
        <div>
            <h1>Admin Settings</h1>
            <p>Create a news post (admins only)</p>

            <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
                <div>
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>

                <div style={{ marginTop: 12 }}>
                    <label>Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={8}
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>

                <div style={{ marginTop: 12 }}>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            </form>

            {message && (
                <div style={{ marginTop: 12, color: message.startsWith('Error') ? 'crimson' : 'red' }}>
                    {message}
                </div>
            )}
        </div>
    );
};