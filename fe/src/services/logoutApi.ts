import axios from "axios";

export async function logoutApi(accessToken:string | null):Promise<any>{
    const route="http://localhost:3000";
    const logoutButton=document.getElementById("logout-button") as HTMLButtonElement;
    logoutButton.disabled=true;

    try{
        const response=await axios.post(`${route}/auth/logout`,{},
            {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true
        });
        logoutButton.disabled=false;
        return response;
    }catch (error:any){
        if(error.response.status===400){
            console.log("You are not logged in");
            logoutButton.disabled=false;
            return;
        }
        alert('Error logging out, please try again');
        logoutButton.disabled=false;
        return;
    }
}