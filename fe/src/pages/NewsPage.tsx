import { Link } from "react-router-dom";
import { routes } from "../constants/routes.ts";
import { useState, useEffect } from 'react';
import { tokenIsAdmin } from '../services';
import { useAuth } from "../hooks";
import type { Post } from '../services/PostAdminApi.ts';
import { createPost, fetchAllPosts } from '../services/PostAdminApi.ts';

export const NewsPage = () => {
 
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const {token}=useAuth();
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [message, setMessage] = useState(String);
    const [isAdmin,setIsAdmin]=useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            alert('Some files were not images and have been ignored.');
          
        }
        setPhotoFiles(validFiles);
        
        if (validFiles.length > 0) {
            const previews: string[] = [];
            let loadedCount = 0;
            
            validFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    previews.push(reader.result as string);
                    loadedCount++;
                    if (loadedCount === validFiles.length) {
                        setPhotoPreviews(previews);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            setPhotoPreviews([]);
        }
    };

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
            await createPost({ title, content, photoFiles }, token);
            if (isAdmin) {
                setMessage('Post created and published successfully');
            } else {
                setMessage('Post submitted for review. An admin will approve it soon.');
            }
            setTitle('');
            setContent('');
            setPhotoFiles([]);
            setPhotoPreviews([]);
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

            <div style={{ marginTop: 12 }}>
              <label>Attach Images (optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                style={{ display: 'block', marginTop: 4 }}
              />
              {photoPreviews.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {photoPreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{ maxWidth: 150, maxHeight: 150, border: '1px solid #ccc' }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
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
        {!loadingPosts && allPosts
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
                {post.photos && post.photos.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                    {post.photos.map((photo, index) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt={`Post image ${index + 1}`}
                        style={{ maxWidth: '100%', maxHeight: 150, border: '1px solid #ccc' }}
                      />
                    ))}
                  </div>
                )}
                <br />
                created at: {new Date(post.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
} 