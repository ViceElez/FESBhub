import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks";
import {updateToken, fetchVerifiedPosts, fetchUnverifiedPosts} from '../services';

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

export const AdminPostsCard = () => {
    const navigate = useNavigate();
    let { token, login, logout } = useAuth();

    const [unverifiedPosts, setUnverifiedPosts] = useState<Post[]>([]);
    const [verifiedPosts, setVerifiedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'unverified' | 'verified'>('unverified');
    const showVerified = activeTab === 'verified';

    useEffect(() => {
        const fetchPosts = async () => {
            token = await updateToken(token!, login, logout, navigate, []);

            if (showVerified) {
                if (verifiedPosts.length > 0) return;
                const res = await fetchVerifiedPosts(token);
                if (res?.status === 200) setVerifiedPosts(res.data);
            } else {
                if (unverifiedPosts.length > 0) return;
                const res = await fetchUnverifiedPosts(token);
                if (res?.status === 200) setUnverifiedPosts(res.data);
            }
        };

        setLoading(true);
        void fetchPosts().then(() => setLoading(false));
    }, [activeTab]);


    const handleToggleVerify = async (postId: number) => {
        console.log("Toggle verify called for postId:", postId);
    };

    const handleDelete = async () => {
        console.log("Delete called");
    }

    if (loading) return <p>Loading posts...</p>;

    const postsToShow = showVerified ? verifiedPosts : unverifiedPosts;

    return (
        <div>
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'unverified' ? 'active' : ''}`}
                    onClick={() => setActiveTab('unverified')}
                >
                    Unverified Posts
                </button>

                <button
                    className={`admin-tab ${activeTab === 'verified' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verified')}
                >
                    Verified Posts
                </button>
            </div>

            <div className="admin-users-container">
                {postsToShow.map(post => (
                    <div key={post.id} className="admin-card">
                        <div className="admin-card-content">
                            <div>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                <p>By: {post.user?.firstName} {post.user?.lastName} (ID: {post.userId})</p>
                                <p>Post ID: {post.id}</p>
                                <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="admin-card-actions">
                                <button onClick={() => handleToggleVerify(post.id)}>
                                    {post.verified ? 'Unverify' : 'Verify'}
                                </button>
                                <button
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {postsToShow.length === 0 && <p>No posts to display.</p>}
            </div>
        </div>
    );
};
