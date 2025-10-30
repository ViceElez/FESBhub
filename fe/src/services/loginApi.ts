import axios from "axios";

export async function loginApi(email:string,password:string):Promise<any>{
    if (!email.endsWith("@fesb.hr")){
        alert("Invalid data provided, make sure the email is a fesb.hr address");
        return;
    }

    const route="http://localhost:3000";
    try {
        const response = await axios.post(`${route}/auth/login`, { email, password });
        alert("Login successful");
        console.log("Login successful:", response.data);
        return response;
    } catch (error:any) {
        if(error.response.status===400){
            alert("Please verify your email before logging in");
            return
        }
        alert('Invalid credentials, please try again');
        console.error("Login failed:", error);
    }
}