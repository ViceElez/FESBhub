import { Link } from "react-router-dom";
import { routes } from "../constants/routes.ts";
import { useState, useEffect } from 'react';
import { tokenIsAdmin } from '../services';
import { useAuth } from "../hooks";
import type { Post } from '../services/PostAdminApi.ts';
import { createPost, fetchAllPosts , approvePost, deletePost} from '../services/PostAdminApi.ts';

export const NewsPage = () => {
 
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const {token}=useAuth();
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [message, setMessage] = useState(String);
    const [isAdmin,setIsAdmin]=useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function checkAdmin() {
            if (!token) {
                setIsAdmin(false);
                
                return;
            }
            const result = await tokenIsAdmin(token);
            setIsAdmin(result);
           
        }
        void checkAdmin();
    }, [token]);

    useEffect(() => {
      
        setLoadingPosts(true);
        fetchAllPosts()
            .then((posts) => {
             
                setAllPosts(posts);
            })
            .catch((err: any) => {
               
              setMessage(`Error fetching posts: ${err?.message ?? 'Unknown error'}`);
            })
            .finally(() => {
                
                setLoadingPosts(false);
            });

        return () => {};
        
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage('');
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
            if (err.response && err.response.data && err.response.data.message) {
                setMessage(`Error: ${err.response.data.message}`);
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
          <button>Materials</button>
        </Link>
        <Link to={routes.SUBJECTPAGE}>
          <button>Subjects</button>
        </Link>
        <Link to={routes.PROFESSORPAGE}>
          <button>Professors</button>
        </Link>
        {isAdmin && (
          <Link to={routes.ADMINSETTINGSPAGE}>
            <button>admin settings page</button>
          </Link>
        )}
      </div>

      {token && (
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
            <div
              style={{
                marginTop: 12,
                color: message.startsWith('Error') ? 'crimson' : 'green',
              }}
            >
              {message}
            </div>
          )}
        </section>
      )}

      <h3>Last 10 posts</h3>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}
      >
        {allPosts
          .filter(post => post.verified === true)
          .map(post => (
            <li
              key={post.id}
              style={{ margin: 12, padding: 12, border: '1px solid #ccc', width: 300 }}
            >
              <strong>
                post Title:
                <br />
                {post.title}
              </strong>
              <div>
                <strong>Content:</strong>
                <br />
                {post.content}
                <br />
                by {post.user?.firstName ?? ''} {post.user?.lastName ?? ''}
                <br />
                verified: {post.verified ? 'yes' : 'no'}
                <br />
                created at: {new Date(post.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
      </ul>

      <h3>Posts not verified</h3>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}
      >
        {/* ovaj dio verificira i deleta postova od usera trebalo bi logiku prebaciti na adminsetting tj. usersettings */}
        {isAdmin &&
          allPosts
            .filter(post => post.verified === false)
            .map(post => (
              <li
                key={post.id}
                style={{ margin: 12, padding: 12, border: '1px solid #ccc', width: 300 }}
              >
                <strong>
                  post Title:
                  <br />
                  {post.title}
                </strong>
                <br />
                <strong>Content:</strong>
                <br />
                {post.content}
                <br />
                user: {post.user?.firstName ?? ''} {post.user?.lastName ?? ''}
                <br />
                verified: {post.verified ? 'yes' : 'no'}
                <button
                  onClick={async () => {
                    if (!token) {
                      setMessage('Error: No token available');
                      return;
                    }

                    try {
                      await approvePost(post.id, token);
                      const updated = await fetchAllPosts();
                      setAllPosts(updated);
                      setMessage('Post verified successfully');
                      
                    } catch (err: any) {
                      setMessage(`Error verifying post: ${err?.message ?? 'Unknown error'}`);
                     
                    }
                  }}
                >
                  Verify Post
                </button>
                <button onClick={async () => {
                  if(!token){
                    setMessage('Error: No token available');
                    return;
                  }
                  try{
                    await deletePost(post.id,token);
                    const updated=await fetchAllPosts();
                    setAllPosts(updated);
                    setMessage('Post deleted successfully');
                  } catch (err: any) {
                    setMessage(`Error deleting post: ${err?.message ?? 'Unknown error'}`);
                  }
                }}>delete post</button>
              </li>
            ))}
      </ul>

      {loadingPosts ? (
        <p>Loading posts...</p>
      ) : (
        allPosts.length === 0 && <p>No posts available.</p>
      )}
    </div>
  );
};
