import axios from "axios";

const route = "http://localhost:3000";

export type MyPost = {
    id: number;
    title: string;
    content: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    photoUrl: string | null;
    photos?: { id: number; url: string; postId: number }[];
};
export type MyProfile = {
    id: number;
    email: string;
    firstName: string;
    lastName: string | null;
    isAdmin: boolean;
    isVerified: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
};


export async function fetchMyPosts(token: string): Promise<MyPost[]> {
    const res = await axios.get(`${route}/posts/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(res.data) ? res.data : [];
}

export async function deleteMyPost(token: string, Id: number) {
    return axios.delete(`${route}/posts/${Id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function updateMyPost(token: string, postId: number, data: { title: string; content: string }) {
    return axios.patch(`${route}/posts/${postId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function getMyProfile(token?: string) {
    return axios.get(`${route}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
export async function updateMyProfile(
    token: string | null,
    data: { firstName: string; lastName: string | null; }   
){return axios.patch(`${route}/user/me`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}