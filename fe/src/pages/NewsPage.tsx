import { Link } from "react-router-dom";
import { routes } from "../constants/routes.ts";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenIsAdmin } from '../services';
import { useAuth } from "../hooks";
import type { Post } from '../services/PostAdminApi.ts';
import { createPost, fetchAllPosts } from '../services/PostAdminApi.ts';

export const NewsPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [postsError, setPostsError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { token } = useAuth();
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

    useEffect(() => {
        let mounted = true;
        setLoadingPosts(true);
        setPostsError(null);

        fetchAllPosts()
            .then((posts) => {
                if (!mounted) return;
                setAllPosts(posts);
            })
            .catch((err: any) => {
                if (!mounted) return;
                setPostsError(err?.message ?? 'Failed to load posts');
            })
            .finally(() => {
                if (!mounted) return;
                setLoadingPosts(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        if (!token) {
            setMessage('Error: No token available');
            setLoading(false);
            return;
        }

        try {
            await createPost({ title, content }, token);
            if (isAdmin) {
                setMessage('Post created and published successfully');
            } else {
                setMessage('Post submitted for review. An admin will approve it soon.');
            }
            setTitle('');
            setContent('');
            const updatedPosts = await fetchAllPosts();
            setAllPosts(updatedPosts);
        } catch (err: any) {
            if (err?.message?.includes('Unauthorized')) {
                navigate(routes.LOGIN);
            } else {
                setMessage(`Error: ${err?.message ?? 'Failed to create post'}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
       
        <div>
            <h1>News Page</h1>
        <div>
                <h2>Other Pages</h2>
                <Link to={routes.MATERIALSPAGE}>
                    <button >Materials</button>
                </Link>
                <Link to={routes.SUBJECTPAGE}>
                    <button >Subjects</button>
                </Link>
                <Link to={routes.PROFESSORPAGE}>
                    <button >Professors</button>
                </Link>
                <Link to={routes.ADMINSETTINGSPAGE}>
                    <button>Admin Settings</button>
                </Link>
            </div>
            {token  && (
                <section style={{ marginBottom: 24, padding: 12, border: '1px solid #ddd' }}>
                    <h2>Create a New Post</h2>
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

                        <div>
                            <label>Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={8}
                                style={{ width: '100%', padding: 8, marginTop: 4 }}
                            />
                        </div>

                        <div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Post'}
                            </button>
                        </div>
                    </form>

                    {message && (
                        <div style={{ marginTop: 12, color: message.startsWith('Error') ? 'crimson' : 'green' }}>
                            {message}
                        </div>
                    )}
                </section>
            )}

            <section style={{ marginBottom: 24 }}>
                <h2>All Posts</h2>
                {loadingPosts && <p>Loading posts...</p>}
                {postsError && <p >{postsError}</p>}
                {!loadingPosts && allPosts.length === 0 && <p>No posts yet.</p>}
                <ul>
                    {allPosts.map((post) => (
                        <li key={post.id} style={{ marginBottom: 16, padding: 12, border: '1px solid #ccc' }}>
                            <strong>{post.title}</strong>
                            <div >
                                by {post.user?.firstName ?? ''} {post.user?.lastName ?? ''}
                            </div>
                            <p >{post.content}</p>
                            <div>
                                {post.verified ? '✓ Published' : 'Pending approval'}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            
        </div>
    );
};
