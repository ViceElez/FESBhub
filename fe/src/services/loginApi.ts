import axios from "axios";

export async function loginApi(email:string,password:string):Promise<any>{

    const loginButton=document.getElementById("login-button") as HTMLButtonElement;
    loginButton.disabled=true;

    if (!email.endsWith("@fesb.hr")){
        alert("Invalid data provided, make sure the email is a fesb.hr address");
        loginButton.disabled=false;
        return;
    }

    const route="http://localhost:3000";
    try {
        const response=await axios.post(`${route}/auth/login`, { email, password });
        loginButton.disabled=false;
        return response;
    } catch (error:any) {
        if(error.response.status===400){
            alert("Please verify your email before logging in");
            loginButton.disabled=false;
            return
        }
        alert('Invalid credentials, please try again');
        loginButton.disabled=false;
        return;
    }
}