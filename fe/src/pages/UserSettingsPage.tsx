import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../constants/routes";
import { useAuth } from "../hooks";
import {
  tokenIsExpired,
  getMyProfile,
  updateMyProfile,
  type MyProfile,
  fetchMyPosts,
  deleteMyPost,
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
                <div className="settings-post-top">
                  <div>
                    <div className="settings-post-title">{p.title}</div>
                    <div className="settings-post-meta">
                      {new Date(p.createdAt).toLocaleString()} •{" "}
                      {p.verified ? "Verified" : "Pending"}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="settings-danger-btn"
                    onClick={() => handleDeleteMyPost(p.id)}
                    disabled={deletingId === p.id}
                  >
                    {deletingId === p.id ? "Brišem..." : "Obriši"}
                  </button>
                </div>

                <p className="settings-post-content">{p.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
