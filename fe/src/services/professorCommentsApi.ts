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

export async function deleteProfessorComment() {
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