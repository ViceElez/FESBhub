import axios from "axios";

export async function newAccessToken():Promise<any>{
    const route="http://localhost:3000";

    try{
        const response=await axios.post(`${route}/auth/refresh-access-token`,{},{
            withCredentials:true
        });
        console.log(response)
        return response;
    }
    catch(error){
        console.log(error);
        return;
    }
}