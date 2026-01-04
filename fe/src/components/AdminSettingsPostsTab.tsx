import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks";
import {updateToken, fetchVerifiedPosts} from '../services';

type Post = {
    id: number;
    title: string;
    content: string;
    userId: number;
    verified: boolean;
    createdAt: string;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email?: string;
    };
}

export const AdminSettingsPostsTab = () => {
    const navigate = useNavigate();
    let { token, login, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [postsToShow, setPostsToShow] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res=await fetchVerifiedPosts(token);
            if(res?.status===200){
                const verifiedPosts: Post[] = res.data;
                setPostsToShow(verifiedPosts);
            }
        };
        setLoading(true);
        void fetchPosts().then(() => setLoading(false));
    }, []);

    const handleDelete = async (postId:number) => {
        console.log("Delete called", postId);
    }

    if (loading) return <p>Loading posts...</p>;


    return (
        <div className="admin-posts-container">
            <h2>All Posts</h2>
            {postsToShow.map(post => (
                <div key={post.id} className="admin-post-card">
                    <div className="admin-post-content">
                        <h3 className="admin-post-title">{post.title}</h3>
                        <p className="admin-post-text">{post.content}</p>
                        <p className="admin-post-meta">
                            By: {post.user?.firstName} {post.user?.lastName} (ID: {post.userId})
                        </p>
                        <p className="admin-post-meta">Post ID: {post.id}</p>
                        <p className="admin-post-meta">
                            Created At: {new Date(post.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <button
                        className="admin-post-delete-btn"
                        onClick={() => handleDelete(post.id)}
                    >
                        Delete
                    </button>
                </div>
            ))}

            {postsToShow.length === 0 && <p>No posts to display.</p>}
        </div>
    );

};
