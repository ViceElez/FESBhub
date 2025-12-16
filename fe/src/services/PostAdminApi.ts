import axios from "axios";

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
  const route = "http://localhost:3000";
  try {
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

// Admin-only: verify a post (set verified = true)
export async function approvePost(postId: number, token: string): Promise<Post> {
  const route = "http://localhost:3000";
  try {
    console.log("treci")
    const response = await axios.patch(
      `${route}/posts/${postId}/verify`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  } catch (error: any) {
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error(error.response.data?.message || 'Not authorized');
    }
    
    throw error;
  }
}
export async function deletePost(postId: number, token: string): Promise<void> {
  const route = "http://localhost:3000";
  try {
    await axios.delete(`${route}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error(error.response.data?.message || 'Not authorized');
    }
  }
}   

export async function createPost(
  dto: { title: string; content: string },
  token: string
): Promise<Post> {
  const route = "http://localhost:3000";
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
