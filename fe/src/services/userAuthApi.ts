import axios from "axios";

const route="http://localhost:3000";

export async function loginApi(email:string,password:string):Promise<any>{

    const loginButton=document.getElementById("login-button") as HTMLButtonElement;
    loginButton.disabled=true;

    // if (!email.endsWith("@fesb.hr")){
    //     alert("Invalid data provided, make sure the email is a fesb.hr address");
    //     loginButton.disabled=false;
    //     return;
    // }

    try {
        const response=await axios.post(`${route}/auth/login`, { email, password },{
            withCredentials: true
        });
        loginButton.disabled=false;
        return response;
    } catch (error:any) {
        if(error.response.status===400){
            alert("Please verify your email before logging in");
            loginButton.disabled=false;
            return {emailVerified:false};
        }
        alert('Invalid credentials, please try again');
        loginButton.disabled=false;
        return;
    }
}

export async function logoutApi(accessToken:string | null):Promise<any>{
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

export async function registerApi(email:string,password:string,firstName:string,study:string|undefined,year:string|undefined, lastName?:string){

    const registerButton=document.getElementById("register-button") as HTMLButtonElement;
    registerButton.disabled=true;

    // if (!email.endsWith("@fesb.hr")){
    //     alert("Invalid data provided, make sure the email is a fesb.hr address");
    //     registerButton.disabled=false;
    //     return;
    // }
    if(password.length<6){
        alert("Password must be at least 6 characters long");
        registerButton.disabled=false;
        return;
    }
    if (study=='Necu Reci'){
        study=undefined;
    }
    if (year=='Necu reci'){
        year=undefined;
    }
    try{
        const response=await axios.post(`${route}/auth/register`, {
            email,
            password,
            firstName,
            lastName,
            studij:study,
            currentStudyYear:year
        },{
            withCredentials: true,
        });
        registerButton.disabled=false;
        return response;
    }
    catch{
        alert("User already exists");
        registerButton.disabled=false;
        return;
    }
}
