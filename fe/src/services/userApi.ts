import axios from 'axios';

const route="http://localhost:3000";

export async function getAllUsersApi(accessToken:string | null){
    try{
        return await axios.get(`${route}/user/allUsers`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }catch (e){
        alert('Error fetching users');
        return;
    }
}

export async function getUserById(userId:number, accessToken:string | null){
    try{
        return await axios.get(`${route}/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }catch (e){
        alert('Error fetching user by ID');
        return;
    }
}

export async function unverifyUserApi(userId:number, accessToken:string | null){
    try{
        return await axios.patch(`${route}/user/unverify/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }catch (e){
        alert('Error unverifying user');
        return;
    }
}

export async function verifyUserApi(userId:number, accessToken:string | null){
    try{
        return await axios.patch(`${route}/user/verify/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }catch (e){
        alert('Error verifying user');
        return;
    }
}

export async function deleteUserApi(userId:number, accessToken:string | null){
    try{
        return await axios.delete(`${route}/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }catch (e){
        alert('Error deleting user');
        return;
    }
}

export async function getUsersByName(name:string, accessToken:string | null){
    try{
        return await axios.get(`${route}/user/search/${name}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }catch (e){
        alert('Error fetching users by name');
        return;
    }
}
