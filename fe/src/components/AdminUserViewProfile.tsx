import { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import {
    getPostsByUserId,
    getProfessorCommentsByUserId,
    getSubjectCommentsByUserId,
    updateToken,
} from "../services";
import "../index.css";
import { useNavigate } from "react-router-dom";

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    studij: string;
    currentStudyYear: number;
    createdAt: string;
    isVerified: boolean;
};

type AdminUserViewProfileProps = {
    open: boolean;
    close: () => void;
    user: User | null;
};

type ProfComment = {
    id: number;
    content: string;
    rating: number;
    verified: boolean;
    createdAt: string;
    professor: {
        firstName: string;
        lastName: string;
    };
};

type SubjComment = {
    id: number;
    content: string;
    ratingExceptions: number;
    ratingDiffuculty: number;
    ratingPracicality: number;
    verified: boolean;
    createdAt: string;
    subject: {
        title: string;
    };
};

type Post = {
    id: number;
    title: string;
    content: string;
    verified: boolean;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
    };
};

type Tab = "profComments" | "subjComments" | "posts" | null;

export const AdminUserViewProfile = ({ open, close, user }: AdminUserViewProfileProps) => {
    const [activeTab, setActiveTab] = useState<Tab>(null);
    const [profComments, setProfComments] = useState<ProfComment[]>([]);
    const [subjComments, setSubjComments] = useState<SubjComment[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    let { token, login, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(null);
        setProfComments([]);
        setSubjComments([]);
        setPosts([]);
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            if (activeTab === "posts") {
                const res = await getPostsByUserId(user!.id, token);
                if (res?.status === 200) setPosts(res.data);
            } else if (activeTab === "profComments") {
                const res = await getProfessorCommentsByUserId(user!.id, token);
                if (res?.status === 200) setProfComments(res.data);
            } else if (activeTab === "subjComments") {
                const res = await getSubjectCommentsByUserId(user!.id, token);
                if (res?.status === 200) setSubjComments(res.data);
            }
        };
        void fetchData();
    }, [activeTab]);

    if (!open || user === null) return null;

    return (
        <div onClick={close} className="profile-modal">
            <div className="profile-container" onClick={(e) => e.stopPropagation()}>
                <button className="view-profile-close-btn" onClick={close}>
                    ✕
                </button>
                <div className="profile-left">
                    <h2>User Info</h2>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Study Program:</strong> {user.studij ?? "None"}</p>
                    <p><strong>Current Study Year:</strong> {user.currentStudyYear ?? "None"}</p>
                    <p><strong>Account Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</p>
                </div>

                <div className="profile-right">
                    <div className="tabs">
                        <button
                            className={activeTab === "profComments" ? "active" : ""}
                            onClick={() => setActiveTab("profComments")}
                        >
                            Professor Comments
                        </button>
                        <button
                            className={activeTab === "subjComments" ? "active" : ""}
                            onClick={() => setActiveTab("subjComments")}
                        >
                            Subject Comments
                        </button>
                        <button
                            className={activeTab === "posts" ? "active" : ""}
                            onClick={() => setActiveTab("posts")}
                        >
                            Posts
                        </button>
                    </div>
                    <div className="tab-content">
                        {activeTab === "profComments" &&
                            (profComments.length === 0 ? (
                                <p className="empty-msg">No professor comments found.</p>
                            ) : (
                                profComments.map((c) => (
                                    <div key={c.id} className="comment-card-profile">
                                        <p><strong>Professor:</strong> {c.professor.firstName} {c.professor.lastName}</p>
                                        <p><strong>Rating:</strong> {c.rating}</p>
                                        <p>{c.content}</p>
                                        <p><em>{c.verified ? "Verified" : "Unverified"} • {new Date(c.createdAt).toLocaleDateString()}</em></p>
                                    </div>
                                ))
                            ))}

                        {activeTab === "subjComments" &&
                            (subjComments.length === 0 ? (
                                <p className="empty-msg">No subject comments found.</p>
                            ) : (
                                subjComments.map((c) => (
                                    <div key={c.id} className="comment-card-profile">
                                        <p><strong>Subject:</strong> {c.subject.title}</p>
                                        <p><strong>Expectation:</strong> {c.ratingExceptions} • <strong>Difficulty:</strong> {c.ratingDiffuculty} • <strong>Practicality:</strong> {c.ratingPracicality}</p>
                                        <p>{c.content}</p>
                                        <p><em>{c.verified ? "Verified" : "Unverified"} • {new Date(c.createdAt).toLocaleDateString()}</em></p>
                                    </div>
                                ))
                            ))}

                        {activeTab === "posts" &&
                            (posts.length === 0 ? (
                                <p className="empty-msg">No posts found.</p>
                            ) : (
                                posts.map((p) => (
                                    <div key={p.id} className="comment-card-profile">
                                        <p><strong>Title:</strong> {p.title}</p>
                                        <p>{p.content}</p>
                                        <p><strong>Author:</strong> {p.user.firstName} {p.user.lastName}</p>
                                        <p><em>{p.verified ? "Verified" : "Unverified"} • {new Date(p.createdAt).toLocaleDateString()}</em></p>
                                    </div>
                                ))
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
