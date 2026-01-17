import axios from "axios";

const route = "http://localhost:3000";
export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  verified: boolean;
  createdAt: string;
  photos?:
   { id: number; 
    url: string
   }[];
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
   
    return Array.isArray(posts) ? posts : [];
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


export async function searchPosts(query: string, token?: string | null) {
  try {
    return await axios.get(`${route}/posts/search`, {
      params: { q: query },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch (e) {
    console.log(e);
    return;
  }
}


// Admin-only: verify a post (set verified = true)
export async function approvePost(postId: number, token: string): Promise<Post> {
  
  try {
   
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
// export async function deletePost(postId: number, token: string): Promise<void> {
  
//   try {
//     await axios.delete(`${route}/posts/${postId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   } catch (error: any) {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       throw new Error(error.response.data?.message || 'Not authorized');
//     }
//   }
// }   

export async function createPost( 
  dto: { title: string; content: string; photoFiles: File[] },
  token: string
): Promise<Post> {

  try {
    let photosBase64: string[] = [];
   

    if (dto.photoFiles && dto.photoFiles.length > 0) {
      // Check each file size
      for (const file of dto.photoFiles) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
          alert(`Image ${file.name} must be less than 5MB`);
          return {} as Post;
        }
      }
      
      // Convert all files to base64
      photosBase64 = await Promise.all(
        dto.photoFiles.map(file => 
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
        )
      );
    }

    const response = await axios.post(`${route}/posts`, {
      title: dto.title,
      content: dto.content,
      photos: photosBase64.length > 0 ? photosBase64 : undefined,
    }, {
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