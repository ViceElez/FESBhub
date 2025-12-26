import axios from 'axios';

const route="http://localhost:3000";

export async function getUnverifiedUsersApi(accessToken:string | null):Promise<any>{
    try{
        const response=await axios.get(`${route}/user/unverifiedUsers`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return response.data;
    }catch (e){
        alert('Error fetching users');
        return;
    }
}

export async function getAllVerifiedUsersApi(accessToken:string | null):Promise<any>{
    try{
        const response=await axios.get(`${route}/user/verifiedUsers`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return response.data;
    }catch (e){
        alert('Error fetching users');
        return;
    }
}

export async function getUserById(userId:number, accessToken:string | null):Promise<any>{
    try{
        const response=await axios.get(`${route}/user/${userId}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return response.data;
    }catch (e){
        alert('Error fetching user by ID');
        return;
    }
}

// export async function getUserByNameApi(username:string, accessToken:string | null):Promise<any>{
//
// }
