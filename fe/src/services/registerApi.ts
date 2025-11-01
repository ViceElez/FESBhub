import axios from "axios";

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
    const route="http://localhost:3000";
    try{
         const response=await axios.post(`${route}/auth/register`, {
            email,
            password,
            firstName,
            lastName,
            studij:study,
            currentStudyYear:year
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