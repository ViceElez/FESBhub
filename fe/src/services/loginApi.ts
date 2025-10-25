import axios from "axios";

export async function loginApi(email:string,password:string){
    const route="http://localhost:3000";
    await axios.post(route+'/auth/login',{
        email,
        password
    }).then(response=>{
       console.log("Login successful:", response.data);
    }).catch(error => console.error('Error login task:', error));
}