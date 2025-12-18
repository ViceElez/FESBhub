import axios from "axios";

const route="http://localhost:3000";

export async function getSubjById(subjId: number, token?: string | null) {
    try{
        const response=await axios.get(`${route}/subj/${subjId}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e){
        console.log(e)
        return
    }
}
export async function get24Subjects(token?: string | null) {
    try{
        const response=await axios.get(`${route}/subj`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e){
        console.log(e)
        return
    }
}
