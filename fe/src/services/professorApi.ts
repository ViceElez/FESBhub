import axios from "axios";

const route="http://localhost:3000";

export async function getAllProfessors(token?: string | null) {
    try{
        return await axios.get(`${route}/prof`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e){
        console.log(e)
        return
    }
}

export async function deleteProfessorById(profId: number, token?: string | null) {
    try{
        return await axios.delete(`${route}/prof/${profId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e){
        alert("Error deleting professor.")
        return
    }
}

export async function getProfessorByName(name: string, token?: string | null) {
    try{
        return await axios.get(`${route}/prof/search/${name}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e){
        console.log(e)
        return
    }
}
