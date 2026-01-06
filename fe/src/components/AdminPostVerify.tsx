import {useState,useEffect} from "react";
import {fetchUnverifiedPosts, type Post, updateToken} from "../services";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";
import {PostCardForValidation} from "./PostCardForValidation.tsx";


export const AdminPostVerify = () => {

    let { token, login, logout } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetch = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res=await fetchUnverifiedPosts(token);
            if (res?.status === 200) setPosts(res.data);
        };
        void fetch();
    }, []);

    const removePost = (id: number) => {
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className='admin-comments-wrapper'>
            {posts.map(p=>(
                <PostCardForValidation key={p.id} post={p} onRemove={removePost}/>
            ))}
            {posts.length === 0 && <p>No posts to display.</p>}
        </div>
    );
}