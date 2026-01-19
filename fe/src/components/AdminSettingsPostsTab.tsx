import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks";
import {updateToken, fetchVerifiedPosts, deletePost, type Post} from '../services';

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
        token = await updateToken(token!, login, logout, navigate, []);
        if(!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
        const res=await deletePost(postId,token);
        if(res?.status===200){
            setPostsToShow(prevPosts => prevPosts.filter(post => post.id !== postId));
            alert('Post deleted successfully.');
        }
    }

    if (loading) return <p>Loading posts...</p>;


    return (
        <div className="admin-posts-container">
            {postsToShow.map(post => (
                <div key={post.id} className="admin-post-card">
                    <div className="admin-post-content">
                        <h3 className="admin-post-title">{post.title}</h3>
                        <p className="admin-post-text">{post.content}</p>
                       {post.photos && post.photos.length > 0 && (
                              <div className="news-post-photos">
                                {post.photos.map((photo, index) => (
                                  <img
                                    key={photo.id}
                                    className="news-photo-thumb"
                                    src={photo.url}
                                    alt={`Post image ${index + 1}`}
                                 
                                  />
                                ))}

                              </div>
                            )}
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
