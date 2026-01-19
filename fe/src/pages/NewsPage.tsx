import { useEffect, useState } from "react";
import { tokenIsAdmin } from "../services";
import { useAuth, useDebounce } from "../hooks";
import type { Post } from "../services/PostAdminApi.ts";
import { createPost, fetchAllPosts, searchPosts } from "../services/PostAdminApi.ts";
import "../styles/NewsPageStyle.css";
type MainView = "userPosts" | "fesbnews";

export const NewsPage = () => {
  const [mainView, setMainView] = useState<MainView>("userPosts");

  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  let { token } = useAuth();
  
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchQuery);

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(""), 2500);
    return () => window.clearTimeout(t);
  }, [message]);

  useEffect(() => {
    const anyModalOpen = isNewPostOpen || selectedImageUrl !== null;
    if (!anyModalOpen) return;

    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old || "auto";
    };
  }, [isNewPostOpen, selectedImageUrl]);

  const initialsOf = (first?: string, last?: string) => {
    const f = (first ?? "").trim();
    const l = (last ?? "").trim();
    const i1 = f ? f[0].toUpperCase() : "U";
    const i2 = l ? l[0].toUpperCase() : "";
    return i1 + i2;
  };

  const openNewPost = () => {
    if (!token) return;
    setMessage("");
    setIsNewPostOpen(true);
  };

  const closeNewPost = () => {
    setIsNewPostOpen(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      alert("Some files were not images and have been ignored.");
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
    const fetchPosts = async () => {
      setCurrentPage(1);
      setLoadingPosts(true);
      const query = debouncedSearchTerm;

      try {
        if (!query) {
          const posts = await fetchAllPosts();
          setAllPosts(
            [...posts].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          );
          return;
        }

        const res = await searchPosts(query, token);
        const posts: Post[] = res?.status === 200 && Array.isArray(res.data)
          ? res.data
          : [];
        setAllPosts(
          [...posts].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (error) {
        console.error("Error fetching/searching posts:", error);
        setAllPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    void fetchPosts();
  }, [debouncedSearchTerm]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!token) {
      setMessage("Error: No token available");
      setLoading(false);
      return;
    }

    try {
      await createPost({ title, content, photoFiles }, token);

      setMessage(
        isAdmin
          ? "Post created and published successfully"
          : "Post submitted for review. An admin will approve it soon."
      );

      setTitle("");
      setContent("");
      setPhotoFiles([]);
      setPhotoPreviews([]);

      const updatedPosts = await fetchAllPosts();
      setAllPosts(updatedPosts);

      closeNewPost();
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setMessage(`Error: ${err.response.data.message}`);
      } else {
        setMessage(`Error: ${err?.message ?? "Failed to create post"}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const messageClass =
    message.length > 0
      ? message.startsWith("Error")
        ? "news-message error"
        : "news-message success"
      : "";

  const visiblePosts = allPosts.filter((post) => post.verified === true);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(visiblePosts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedPosts = visiblePosts.slice(startIdx, endIdx);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="news-page-container">
      <div className="news-top-toggle">
        <div className="news-top-toggle-inner">
          <button
            type="button"
            className={`news-top-toggle-btn ${mainView === "userPosts" ? "active" : ""
              }`}
            onClick={() => setMainView("userPosts")}
          >
            User Posts
          </button>

          <span style={{ color: "#748CAB", opacity: 0.9 }}>/</span>

          <button
            type="button"
            className={`news-top-toggle-btn ${mainView === "fesbnews" ? "active" : ""
              }`}
            onClick={() => setMainView("fesbnews")}
          >
            FESBnews
          </button>
        </div>
      </div>

      <div className="news-body">
        <div className="news-panel">
          {mainView === "fesbnews" && (
            <div className="news-placeholder">
              <h3 style={{ marginTop: 0, color: "#F0EBD8" }}>FESBnews</h3>
              <p>Skeleton — logiku ubacujemo kasnije.</p>
            </div>
          )}

          {mainView === "userPosts" && (
            <>
              <div className="news-userposts-header">
                <h3 style={{ margin: 0 }}>User Posts</h3>

                <button
                  type="button"
                  className="news-newpost-btn"
                  onClick={openNewPost}
                  disabled={!token}
                  title={!token ? "You must be logged in to create a post." : ""}
                >
                  New post
                </button>
              </div>

              {message && <div className={messageClass}>{message}</div>}

              <div className="news-feed-column">
                <div className="news-feed">
                  {loadingPosts ? (
                    <p>Loading...</p>
                  ) : (
                    paginatedPosts.map((post) => (
                          <div className="news-post-card" key={post.id}>
                            <div className="news-post-header">
                              <div className="news-avatar">
                                {initialsOf(
                                  post.user?.firstName,
                                  post.user?.lastName
                                )}
                              </div>

                              <div className="news-post-header-text">
                                <div className="news-post-author">
                                  {post.user?.firstName ?? ""}{" "}
                                  {post.user?.lastName ?? ""}
                                </div>
                                <div className="news-post-date">
                                  {new Date(post.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            <div className="news-post-title">{post.title}</div>
                            <p className="news-post-content">{post.content}</p>

                            {post.photos && post.photos.length > 0 && (
                              <div className="news-post-photos">
                                {post.photos.map((photo, index) => (
                                  <img
                                    key={photo.id}
                                    className="news-photo-thumb"
                                    src={photo.url}
                                    alt={`Post image ${index + 1}`}
                                    onClick={() => setSelectedImageUrl(photo.url)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>

                  <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "#748CAB" }}>
                    Showing {startIdx + 1}-{Math.min(endIdx, visiblePosts.length)} of {visiblePosts.length} posts
                  </div>

                  {totalPages > 1 && (
                    <div className="news-pagination">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            className={`news-pagination-btn ${
                              currentPage === page ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
        </div>
      </div>

      {mainView === "userPosts" && (
        <aside className="news-side-panel">
          <div className="news-side-title">Search</div>
          <input
            type="text"
            className="news-side-input"
            placeholder="Type here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <p className="news-side-hint">
            Search for user posts by keywords in the title or content.
          </p>
        </aside>
      )}
      {isNewPostOpen && (
        <div className="news-modal-overlay" onClick={closeNewPost}>
          <div className="news-modal" onClick={(e) => e.stopPropagation()}>
            <div className="news-modal-header">
              <h3>New post</h3>
              <button
                type="button"
                className="news-modal-close"
                onClick={closeNewPost}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="news-modal-body">
              <form className="news-form" onSubmit={handleSubmit}>
                <div>
                  <label>Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={8}
                  />
                </div>

                <div>
                  <label>Attach Images (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                  />

                  {photoPreviews.length > 0 && (
                    <div className="news-previews">
                      {photoPreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Preview ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {message && (
                  <div className={messageClass} style={{ marginTop: 0 }}>
                    {message}
                  </div>
                )}

                <div className="news-form-actions">
                  <button
                    type="submit"
                    className="news-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedImageUrl && (
        <div
          className="news-modal-overlay"
          onClick={() => setSelectedImageUrl(null)}
        >
          <div
            className="news-image-viewer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="news-modal-header">
              <h3>Image</h3>
              <button
                type="button"
                className="news-modal-close"
                onClick={() => setSelectedImageUrl(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <img src={selectedImageUrl} alt="Full view" />
          </div>
        </div>
      )}
    </div>
  );
};