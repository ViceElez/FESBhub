import axios from "axios";

export async function newAccessToken():Promise<any>{
    const route="http://localhost:3000";

    try{
        return await axios.post(`${route}/auth/refresh-access-token`,{},{
            withCredentials:true
        });
    }
    catch(error){
        return;
    }
}