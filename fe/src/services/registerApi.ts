import axios from "axios";

export async function registerApi(email:string,password:string,firstName:string,study:string|undefined,year:string|undefined, lastName?:string){
    if (study=='Necu Reci'){
        study=undefined;
    }
    if (year=='Necu reci'){
        year=undefined;
    }
    const route="http://localhost:3000";
    await axios.post(route+'/auth/register',{
        email,
        password,
        firstName,
        lastName,
        studij:study,
        currentStudyYear:year
    }).then(response=>{
        console.log("Registration successful:", response.data);
    }).catch(error => console.error('Error registration task:', error));
} 
//treba naprait validaciju na fe za ovo i bolje handalt errore, isto za login