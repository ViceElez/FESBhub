import axios from "axios";

const route = "http://localhost:3000";

export type MyPost = {
    id: number;
    title: string;
    content: string;
    verified: boolean;
    createdAt: string;
};

export async function fetchMyPosts(token: string): Promise<MyPost[]> {
    const res = await axios.get(`${route}/posts/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(res.data) ? res.data : [];
}

export async function deleteMyPost(token: string, postId: number) {
    return axios.delete(`${route}/posts/me/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}