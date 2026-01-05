import axios from "axios";

const route="http://localhost:3000";

export async function addProfessorComment(profId: number, rating: number, content: string, token?: string | null, userId?: string | undefined) {
    try{
        return axios.post(`${route}/comment-prof`,{
            "userId": parseInt(userId!!),
            "professorId": profId,
            "rating": rating,
            "content": content
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e){
        console.log(e)
        return
    }
}

export async function deleteProfessorComment(profId: number,token?: string | null, userId?: number) {
    try{
        return axios.delete(`${route}/comment-prof/`,{
            data:{
                "userId": userId,
                "professorId": profId
            },
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
    }catch (e){
        console.log(e)
        return
    }
}

export async function editProfessorComments(profId: number, rating: number, content: string, token?: string | null, userId?: string | undefined){
    try{
        return axios.patch(`${route}/comment-prof/`,
            {
                "userId": userId,
                "professorId": profId,
                "newRating": rating,
                "newContent": content,
                "oldRating": 0,
                "oldContent": ""
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    }catch (e){
        console.log(e)
        return
    }
}

export async function getProfessorComments(profId:number, token?: string | null, userId?: string | undefined){
    try{
        return axios.get(`${route}/comment-prof/exists?profId=${profId}&userId=${userId}`, {
        headers: {
            Authorization:`Bearer ${token}`
        }
    })
    }catch (e){
        console.log(e)
        return
    }
}

export async function getUnverifiedProfessorComments(token?: string | null){
    try{
        return axios.get(`${route}/comment-prof/all`, {
            headers: {
                Authorization:`Bearer ${token}`
            }
        })
    }catch (e){
        console.log(e)
        return
    }
}

export async function verifyProfessorComment(profId:number, userId:number, rating:number, content:string, token?: string | null){
    try{
        return await axios.patch(`${route}/comment-prof/verify`,
            {
                "userId": userId,
                "professorId": profId,
                "rating": rating,
                "content": content
            }, 
            {                    
                headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }catch (e){
        console.log(e)
        return
    }
};

export async function getVerifiedProfessorComments(profId:number, token?: string | null){
    try{
        return axios.get(`${route}/comment-prof/verified?profId=${profId}`, {
            headers: {
                Authorization:`Bearer ${token}`
            }
        })
    }catch (e){
        console.log(e)
        return
    }
}

export async function getProfessorCommentsByUserId(userId:number, token?: string | null){
    try{
        return axios.get(`${route}/comment-prof/user/${userId}`, {
            headers: {
                Authorization:`Bearer ${token}`
            }
        })
    }catch (e){
        alert('Error fetching professor comments.');
        return
    }
}