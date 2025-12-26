import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks";
import { updateToken, fetchVerifiedPosts, fetchUnverifiedPosts } from '../services';

type Post= {
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

export const AdminPostsCard = ({showVerified}: { showVerified: boolean }) => {
    const navigate = useNavigate();
    let { token,login,logout } = useAuth();
    const [unverifiedPosts, setUnverifiedPosts] = useState<Post[]>([]);
    const [verifiedPosts, setVerifiedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
         const fetchPosts = async () => {
                token = await updateToken(token!, login, logout, navigate, []);
                if (showVerified) {
                      if(verifiedPosts.length > 0) return;
                      const res = await fetchVerifiedPosts(token);
                      if (res?.status === 200) {
                          setVerifiedPosts(res.data);
                      }

                }else{
                      if(unverifiedPosts.length > 0) return;
                      const res = await fetchUnverifiedPosts(token);
                      if (res?.status === 200) {
                          setUnverifiedPosts(res.data);
                      }
                }
         }
         void fetchPosts().then(() => setLoading(false));
    }, [showVerified]);

    if (loading) return <p>Loading posts...</p>;

  return (
    <div>
        {(showVerified ? verifiedPosts : unverifiedPosts).map((post) => (
            <div key={post.id} className="admin-card">
                {showVerified ? (
                    <div>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p>By: {post.user?.firstName} {post.user?.lastName} (ID: {post.userId})</p>
                        <p>Post ID: {post.id}</p>
                        <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                ) : (
                    <div>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p>By: {post.user?.firstName} {post.user?.lastName} (ID: {post.userId})</p>
                        <p>Post ID: {post.id}</p>
                        <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                )}
            </div>
        ))}
    </div>
  );
}