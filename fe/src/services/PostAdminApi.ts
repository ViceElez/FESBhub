import axios from "axios";

const route = "http://localhost:3000";
export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  verified: boolean;
  createdAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export async function fetchAllPosts(): Promise<Post[]> {
  try {
      //stavi da token prima
    const response = await axios.get(`${route}/posts`);
    const posts = response.data;
    return Array.isArray(posts) ? posts.slice(0, 10) : [];
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.log("No posts available");
      return [];
    }
    throw new Error(error.response?.data?.message ?? error.message ?? 'Failed to load posts');
  }
}

export async function fetchUnverifiedPosts(token?: string | null) {
    try {
        return await axios.get(`${route}/posts/unverified`, {
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
    }catch (e){
        throw e;
    }
}

export async function fetchVerifiedPosts(token?: string | null) {
    try {
        return await axios.get(`${route}/posts/verified`, {
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
    }catch (e){
        throw e;
    }
}

export async function createPost(
  dto: { title: string; content: string },
  token: string
): Promise<Post> {
  try {
    const response = await axios.post(`${route}/posts`, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error(error.response?.data?.message ?? error.message ?? 'Failed to create post');
  }
}

export async function deletePost(id: number, token:string | null) {
  try {
    return axios.delete(`${route}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error(error.response?.data?.message ?? error.message ?? 'Failed to delete post');
  }
}

export async function getPostsByUserId(userId: number, token?: string | null) {
    try {
        return axios.get(`${route}/posts/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        alert('Failed to fetch posts.');
        return
    }
}

export async function verifyPost(id: number, token: string | null) {
    try {
        return axios.patch(`${route}/posts/verify/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        throw e;
    }
}