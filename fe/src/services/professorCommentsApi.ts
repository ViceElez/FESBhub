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

export async function deleteProfessorComment(profId: number,token?: string | null, userId?: string | undefined) {
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
