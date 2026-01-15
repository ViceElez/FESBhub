import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../constants";
import { useAuth } from "../hooks";
import {
  tokenIsExpired,
  getMyProfile,
  updateMyProfile,
  type MyProfile,
  fetchMyPosts,
  deleteMyPost,
  updateMyPost,
  type MyPost,
} from "../services";
import "../styles/UserSettingsPageStyle.css";

export const UserSettingsPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const expired = token ? tokenIsExpired(token) : true;

  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [myPostsLoading, setMyPostsLoading] = useState(false);
  const [myPostsErr, setMyPostsErr] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (profileLoading || profile) return;

    setProfileLoading(true);
    setErr(null);

    (async () => {
      try {
        const res = await getMyProfile(token);
        setProfile(res.data);

        if (!nameTouched) {
          setFirstName(res.data.firstName ?? "");
          setLastName(res.data.lastName ?? "");
        }
      } catch {
        setErr("Ne mogu dohvatiti profil.");
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [token, profile, profileLoading, nameTouched]);

  const loadMyPosts = async () => {
    if (!token) return;

    setMyPostsLoading(true);
    setMyPostsErr(null);

    try {
      const posts = await fetchMyPosts(token);
      setMyPosts(posts);
    } catch {
      setMyPostsErr("Ne mogu dohvatiti tvoje postove.");
    } finally {
      setMyPostsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    if (expired) return;
    void loadMyPosts();
  }, [token, expired]);

  const handleSaveProfile = async () => {
    setMsg(null);
    setErr(null);

    const fn = firstName.trim();
    const ln = lastName.trim();

    if (!fn) {
      setErr("Ime je obavezno.");
      return;
    }
    if (!token) {
      setErr("Nema tokena.");
      return;
    }

    setSaving(true);
    try {
      const res = await updateMyProfile(token, {
        firstName: fn,
        lastName: ln ? ln : null,
      });
      setProfile(res.data);
      setMsg("Spremljeno");
      window.setTimeout(() => setMsg(null), 2500);
    } catch {
      setErr("Spremanje nije uspjelo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMyPost = async (id: number) => {
    if (!token) return;

    const ok = window.confirm("Jesi siguran da želiš obrisati ovaj post?");
    if (!ok) return;

    setDeletingId(id);
    setMyPostsErr(null);

    try {
      await deleteMyPost(token, id);
      setMyPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setMyPostsErr("Brisanje nije uspjelo.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (post: MyPost) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleSaveEdit = async (postId: number) => {
    if (!token) return;

    const t = editTitle.trim();
    const c = editContent.trim();

    if (!t) {
      setMyPostsErr("Naslov ne može biti prazan.");
      return;
    }
    if (!c) {
      setMyPostsErr("Sadržaj ne može biti prazan.");
      return;
    }

    setEditSaving(true);
    setMyPostsErr(null);

    try {
      const response = await updateMyPost(token, postId, { title: t, content: c });
      setMyPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, title: t, content: c, verified: response.data.verified } : p
        )
      );
      handleCancelEdit();
      
      // Show message if post needs re-approval
      if (!response.data.verified) {
        setMyPostsErr("Post updated successfully. It will need admin approval before being published.");
        setTimeout(() => setMyPostsErr(null), 3000);
      }
    } catch {
      setMyPostsErr("Spremanje nije uspjelo.");
    } finally {
      setEditSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="settings-page-bg">
        <div className="settings-page">
          <div className="settings-card">
            <div className="settings-header">
              <h1 className="settings-title">Settings</h1>
            </div>

            <p>Moraš biti ulogiran da vidiš postavke.</p>

            <div className="settings-actions">
              <button type="button" onClick={() => navigate(routes.LOGIN)}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="settings-page-bg">
        <div className="settings-page">
          <div className="settings-card">
            <div className="settings-header">
              <h1 className="settings-title">Settings</h1>
            </div>

            <p>Sesija je istekla. Ulogiraj se opet.</p>

            <div className="settings-actions">
              <button type="button" onClick={() => navigate(routes.LOGIN)}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page-bg">
      <div className="settings-page">
        <div className="settings-card">
          <div className="settings-header">
            <h1 className="settings-title">Settings</h1>
          </div>

          <div className="settings-section-head">
            <h2 className="settings-section-title" style={{ margin: 0 }}>
              Profil
            </h2>
            {msg && <div className="settings-badge success">{msg}</div>}
          </div>

          {profileLoading && <p>Učitavanje...</p>}
          {err && <div className="settings-msg error">{err}</div>}

          <div className="settings-form">
            <label>
              Ime*
              <input
                value={firstName}
                onChange={(e) => {
                  setNameTouched(true);
                  setFirstName(e.target.value);
                }}
              />
            </label>

            <label>
              Prezime
              <input
                value={lastName}
                onChange={(e) => {
                  setNameTouched(true);
                  setLastName(e.target.value);
                }}
              />
            </label>

            <div className="settings-actions">
              <button
                type="button"
                className="settings-primary-btn"
                onClick={handleSaveProfile}
                disabled={saving || profileLoading}
              >
                {saving ? "Spremam..." : "Spremi promjene"}
              </button>
            </div>
          </div>

          <div className="settings-divider" />

          <div className="settings-section-head">
            <h2 className="settings-section-title" style={{ margin: 0 }}>
              Moji postovi
            </h2>

            <button
              type="button"
              onClick={loadMyPosts}
              disabled={myPostsLoading}
              className="settings-secondary-btn"
            >
              {myPostsLoading ? "Učitavam..." : "Refresh"}
            </button>
          </div>

          {myPostsErr && <div className="settings-msg error">{myPostsErr}</div>}

          {!myPostsLoading && myPosts.length === 0 && (
            <p style={{ opacity: 0.85 }}>Nemaš još postova.</p>
          )}

          <div className="settings-posts">
            {myPosts.map((p) => (
              <div key={p.id} className="settings-post-card">
                {editingId === p.id ? (
                  <div className="settings-edit-form">
                    <label>
                      Naslov
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </label>
                    <label>
                      Sadržaj
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                      />
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <button
                        type="button"
                        className="settings-primary-btn"
                        onClick={() => handleSaveEdit(p.id)}
                        disabled={editSaving}
                      >
                        {editSaving ? "Spremam..." : "Spremi"}
                      </button>
                      <button
                        type="button"
                        className="settings-secondary-btn"
                        onClick={handleCancelEdit}
                        disabled={editSaving}
                      >
                        Odustani
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="settings-post-top">
                      <div>
                        <div className="settings-post-title">{p.title}</div>
                        <div className="settings-post-meta">
                          {new Date(p.createdAt).toLocaleString()} •{" "}
                          {p.verified ? "Verified" : "Pending"}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="settings-secondary-btn"
                          onClick={() => handleStartEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="settings-danger-btn"
                          onClick={() => handleDeleteMyPost(p.id)}
                          disabled={deletingId === p.id}
                        >
                          {deletingId === p.id ? "Brišem..." : "Obriši"}
                        </button>
                      </div>
                    </div>

                    <p className="settings-post-content">{p.content}</p>
                    {p.photos && p.photos.length > 0 && (
                      <div className="news-post-photos">
                        {p.photos.map((photo, index) => (
                          <img
                            key={photo.id}
                            className="news-photo-thumb"
                            src={photo.url}
                            alt={`Post image ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
