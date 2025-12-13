import axios from "axios";

const route = "http://localhost:3000";

export type MyProfile = {
    id: number;
    email: string;
    firstName: string;
    lastName: string | null;
    bio: string | null;
    isAdmin: boolean;
    isVerified: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
};

export async function getMyProfile(token?: string) {
    return axios.get<MyProfile>(`${route}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function updateMyProfile(
    token: string | null,
    data: { firstName: string; lastName: string | null; bio: string | null }
) {
    return axios.patch<MyProfile>(`${route}/user/me`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}