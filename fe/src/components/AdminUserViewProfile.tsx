import {useEffect, useState} from "react";
import {useAuth} from "../hooks";
import {getPostsByUserId, getProfessorCommentsByUserId, getSubjectCommentsByUserId, updateToken} from "../services";
import '../index.css';
import {useNavigate} from "react-router-dom";

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
type profComments={
    id:number;
    content:string;
    rating:number;
    verified:boolean;
    createdAt:string;
    professor:{
        firstName:string;
        lastName:string;
    }
}
type subjComments = {
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
}

type Posts={
    id:number;
    title:string;
    content:string;
    verified:boolean;
    createdAt:string;
    user:{
        firstName:string;
        lastName:string;
    }
}
type Tab =
    "profComments"
    | "subjComments"
    | "posts"
    | null;

export const AdminUserViewProfile = ({open,close,user}:AdminUserViewProfileProps) => {
    const [activeTab, setActiveTab] = useState<Tab>(null);
    const [profComments, setProfComments] = useState<profComments[]>([]);
    const [subjComments, setSubjComments] = useState<subjComments[]>([]);
    const [posts, setPosts] = useState<Posts[]>([]);
    let { token, login, logout} = useAuth();
    const navigate=useNavigate();


    useEffect(() => {
        setActiveTab(null);
        setProfComments([]);
        setSubjComments([]);
        setPosts([]);
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            token=await updateToken(token!, login, logout, navigate, []);
            if(activeTab === 'posts'){
                const res=await getPostsByUserId(user!.id, token);
                if(res?.status===200){
                    setPosts(res.data);
                }
            }
            else if(activeTab === 'profComments'){
                const res=await getProfessorCommentsByUserId(user!.id, token);
                if(res?.status===200){
                    setProfComments(res.data);
                }
            }
            else if(activeTab === 'subjComments'){
                const res=await getSubjectCommentsByUserId(user!.id, token);
                if(res?.status===200){
                    setSubjComments(res.data);
                }
            }
        }
        void fetchData();
    }, [activeTab]);

    if(!open || user===null){
        return null;
    }

    return (
        <div
            onClick={close}
            className="admin-user-view-profile">
            <div
                onClick={(e) => {e.stopPropagation();}}
            >
                <div>
                    <button onClick={() => setActiveTab("profComments")}>Professor Comments</button>
                    <button onClick={() => setActiveTab("subjComments")}>Subject Comments</button>
                    <button onClick={() => setActiveTab("posts")}>Posts</button>
                    <button onClick={close}>X</button>
                </div>
                <div>
                    <h2>User Profile</h2>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Study Program:</strong> {user.studij ?? "None"}</p>
                    <p><strong>Current Study Year:</strong> {user.currentStudyYear ?? "None"}</p>
                    <p><strong>Account Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</p>
                </div>
                <div>
                    {activeTab === "profComments" && (
                        <div>
                            <h3>Professor Comments</h3>
                            {profComments.length === 0 ? (
                                <p>No professor comments found.</p>
                            ) : (
                                profComments.map((comment) => (
                                    <div key={comment.id}>
                                        <p><strong>Professor:</strong> {comment.professor.firstName} {comment.professor.lastName}</p>
                                        <p><strong>Rating:</strong> {comment.rating}</p>
                                        <p><strong>Content:</strong> {comment.content}</p>
                                        <p><strong>Verified:</strong> {comment.verified ? "Yes" : "No"}</p>
                                        <p><strong>Created At:</strong> {new Date(comment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === "subjComments" && (
                        <div>
                            <h3>Subject Comments</h3>
                            {subjComments.length === 0 ? (
                                <p>No subject comments found.</p>
                            ) : (
                                subjComments.map((comment) => (
                                    <div key={comment.id}>
                                        <p><strong>Subject:</strong> {comment.subject.title}</p>
                                        <p><strong>Rating Expectation:</strong> {comment.ratingExceptions}</p>
                                        <p><strong>Rating Difficulty:</strong> {comment.ratingDiffuculty}</p>
                                        <p><strong>Rating Practicality:</strong> {comment.ratingPracicality}</p>
                                        <p><strong>Content:</strong> {comment.content}</p>
                                        <p><strong>Verified:</strong> {comment.verified ? "Yes" : "No"}</p>
                                        <p><strong>Created At:</strong> {new Date(comment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === "posts" && (
                        <div>
                            <h3>Posts</h3>
                            {posts.length === 0 ? (
                                <p>No posts found.</p>
                            ) : (
                                posts.map((post) => (
                                    <div key={post.id}>
                                        <p><strong>Title:</strong> {post.title}</p>
                                        <p><strong>Content:</strong> {post.content}</p>
                                        <p><strong>Author:</strong> {post.user.firstName} {post.user.lastName}</p>
                                        <p><strong>Verified:</strong> {post.verified ? "Yes" : "No"}</p>
                                        <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}