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

export async function getAllSubjects(token?: string | null) {
    try{
        return await axios.get(`${route}/subj`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e){
        return
    }
}

export async function deleteSubjectById(subjId: number, token?: string | null) {
    try{
        return await axios.delete(`${route}/subj/${subjId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e){
        alert("Error deleting subject.")
        return
    }
}

export async function getSubjByName(subjName: string, token?: string | null) {
    try{
        return await axios.get(`${route}/subj/search?q=${subjName}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e){
        return
    }
}
