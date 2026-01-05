import {deletePost, type Post} from "../services";
import {updateToken} from "../services";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export const PostCardForValidation = (post:Post) => {
    const [deleted, setDeleted] = useState(false);
    let{ token, login, logout } = useAuth();
    const navigate = useNavigate();

    if(deleted) return <div></div>;

    const handleVerify = async () => {
        token = await updateToken(token!, login, logout, navigate, []);
        // Verification logic here
     }

    const handleDelete = async () => {
        setDeleted(true);
        token= await updateToken(token!, login, logout, navigate, []);
        if(!confirm('Are you sure you want to delete this post?')){
            setDeleted(false);
            return;
        }
        const res=await deletePost(post.id, token);
        if(res?.status === 200){
            setDeleted(true);
            alert("Successfully deleted post");
        }else{
            setDeleted(false);
            alert("Error deleting post");
        }
    }

    return(
        <div className="comment-card">
            <div className="comment-content">
                <h2>Title: {post.title}</h2>
                <h2>Content: {post.content}</h2>
                <p>Author ID: {post.userId}</p>
                <p>Created At:{post.createdAt}</p>
            </div>
            <div className="comment-actions">
                <button className="verify-btn" onClick={handleVerify}>Verify</button>
                <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}