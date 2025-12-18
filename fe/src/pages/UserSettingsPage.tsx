import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { routes } from "../constants/routes";
import { useAuth } from "../hooks";
import {
  tokenIsAdmin,
  tokenIsExpired,
  getMyProfile,
  updateMyProfile,
  type MyProfile,
  fetchMyPosts,
  deleteMyPost,
  type MyPost,
} from "../services";

type Tab =
  | "profile"
  | "my-posts"
  | "admin-drive"
  | "admin-posts";

type TabDef = {
  key: Tab;
  label: string;
  adminOnly?: boolean;
};

const ALL_TABS: TabDef[] = [
  { key: "profile", label: "Profil" },
  { key: "my-posts", label: "Moji postovi" },

  // admin-only
  { key: "admin-drive", label: "Admin: Drive", adminOnly: true },
  { key: "admin-posts", label: "Admin: Postovi", adminOnly: true },
];

export const UserSettingsPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { token } = useAuth();

  const expired = token ? tokenIsExpired(token) : true;

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoaded, setAdminLoaded] = useState(false);
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

  const availableTabs = useMemo(() => {
    return ALL_TABS.filter((t) => (t.adminOnly ? isAdmin : true));
  }, [isAdmin]);

  const activeTab = (params.get("tab") as Tab | null) ?? "profile";
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

  useEffect(() => {
    if (!token) return;
    if (activeTab !== "my-posts") return;

    setMyPostsLoading(true);
    setMyPostsErr(null);

    (async () => {
      try {
        const posts = await fetchMyPosts(token);
        setMyPosts(posts);
      } catch {
        setMyPostsErr("Ne mogu dohvatiti tvoje postove.");
      } finally {
        setMyPostsLoading(false);
      }
    })();
  }, [token, activeTab]);

  useEffect(() => {
    if (!token) return;
    if (activeTab !== "profile") return;
    if (profileLoading || profile) return;

    setProfileLoading(true);
    setErr(null);

    (async () => {
      try {
        const res = await getMyProfile(token);
        setProfile(res.data);
        setFirstName(res.data.firstName ?? "");
        setLastName(res.data.lastName ?? "");
       
      } catch {
        setErr("Ne mogu dohvatiti profil.");
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [token, activeTab, profile, profileLoading]);

  const handleSaveProfile = async () => {
    setMsg(null);
    setErr(null);

    const fn = firstName.trim();
    const ln = lastName.trim();
   

    if (!fn) {
      setErr("Ime je obavezno.");
      return;
    }

    setSaving(true);
    try {
      const res = await updateMyProfile(token, {
        firstName: fn,
        lastName: ln ? ln : null,
         });
      setProfile(res.data);
      setMsg("Spremljeno ✅");
    } catch {
      setErr("Spremanje nije uspjelo.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      if (!token) {
        if (!mounted) return;
        setIsAdmin(false);
        setAdminLoaded(true);
        return;
      }

      const result = await tokenIsAdmin(token);
      if (!mounted) return;

      setIsAdmin(result);
      setAdminLoaded(true);
    }

    setAdminLoaded(false);
    void checkAdmin();

    return () => {
      mounted = false;
    };
  }, [token]);


  useEffect(() => {
    const ok = availableTabs.some((t) => t.key === activeTab);
    if (!ok && availableTabs.length > 0) {
      setParams({ tab: availableTabs[0].key }, { replace: true });
    }
  }, [activeTab, availableTabs, setParams]);

  if (!token) {
    return (
      <div>
        <h1>Settings</h1>
        <p>Moraš biti ulogiran da vidiš postavke.</p>
        <button onClick={() => navigate(routes.LOGIN)}>Login</button>
      </div>
    );
  }

  if (expired) {
    return (
      <div>
        <h1>Settings</h1>
        <p>Sesija je istekla. Ulogiraj se opet.</p>
        <button onClick={() => navigate(routes.LOGIN)}>Login</button>
      </div>
    );
  }

  if (!adminLoaded) {
    return <p>Loading settings...</p>;
  }

  const setTab = (t: Tab) => setParams({ tab: t }, { replace: true });

  return (
    <div style={{ width: "100%", maxWidth: 1000 }}>
      <h1 style={{ marginBottom: 12 }}>Settings</h1>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <aside style={{ minWidth: 220, border: "1px solid #444", borderRadius: 12, padding: 12 }}>
          <div style={{ marginBottom: 10, opacity: 0.85 }}>
            Uloga: <strong>{isAdmin ? "Admin" : "User"}</strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {availableTabs.map((t) => {
              const selected = t.key === activeTab;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    textAlign: "left",
                    border: selected ? "1px solid #646cff" : "1px solid transparent",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <section style={{ flex: 1, border: "1px solid #444", borderRadius: 12, padding: 16 }}>
          {activeTab === "profile" && (
            <div>
              <h2>Profil</h2>

              {profileLoading && <p>Učitavanje...</p>}
              {err && <p style={{ color: "crimson" }}>{err}</p>}
              {msg && <p style={{ color: "limegreen" }}>{msg}</p>}

              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420 }}>
                <label>
                  Ime*
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </label>

                <label>
                  Prezime
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>

               
                <button onClick={handleSaveProfile} disabled={saving || profileLoading}>
                  {saving ? "Spremam..." : "Spremi promjene"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "my-posts" && (
            <div>
              <h2>Moji postovi</h2>

              {myPostsLoading && <p>Učitavanje...</p>}
              {myPostsErr && <p style={{ color: "crimson" }}>{myPostsErr}</p>}

              {!myPostsLoading && myPosts.length === 0 && (
                <p>Nemaš još postova.</p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {myPosts.map((p) => (
                  <div
                    key={p.id}
                    style={{ border: "1px solid #444", borderRadius: 12, padding: 12 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <strong>{p.title}</strong>
                        <div style={{ opacity: 0.8, fontSize: 12 }}>
                          {new Date(p.createdAt).toLocaleString()} • {p.verified ? "Verified" : "Pending"}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMyPost(p.id)}
                        disabled={deletingId === p.id}
                      >
                        {deletingId === p.id ? "Brišem..." : "Obriši"}
                      </button>
                    </div>

                    <p style={{ marginTop: 8 }}>{p.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "admin-drive" && isAdmin && (
            <div>
              <h2>Admin: Drive</h2>
              <p>Ovdje će biti admin opcije za drive (upload, delete, permissions...).</p>
            </div>
          )}

          {activeTab === "admin-posts" && isAdmin && (
            <div>
              <h2>Admin: Postovi</h2>
              <p>Ovdje može doći moderacija/potvrda postova.</p>
              <button onClick={() => navigate(routes.NEWSPAGE)}>Otvori News Page</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};