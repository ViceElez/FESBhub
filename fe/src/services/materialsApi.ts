import axios from "axios";

const route="http://localhost:3000";

export async function getAllMaterialsApi(token:string | null){
    try{
        return await axios.get(`${route}/mats/folders`,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    }catch (e){
        alert('Error fetching materials');
        return;
    }
}

export async function getFilesInCurrentFolderApi(folderId:number, token:string | null){
    try{
        return await axios.get(`${route}/mats/folders/${folderId}/files`,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    }catch (e){
        alert('Error fetching files in folder');
        return;
    }
}