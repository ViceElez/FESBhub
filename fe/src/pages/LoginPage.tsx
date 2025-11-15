import {loginApi} from "../services";
import {Link, useNavigate} from "react-router-dom";
import {routes} from "../constants/routes.ts";
import {useAuth} from "../hooks";
import {useEffect} from "react";

export const LoginPage =()=>{
    const {token,login}=useAuth()
    const navigate=useNavigate()

    const handleLoginSubmit=async(event:any)=>{
        event.preventDefault();
        const formData=new FormData(event.target);
        const email=formData.get('email') as string;
        const password=formData.get('password') as string;

        const response= await loginApi(email,password)
        if(response?.status===201){
            alert('Login successful!');
            login(response.data);
            return
        }
        else if(response?.emailVerified===false){
            navigate(`${routes.VERIFYEMAILPAGE}?email=${encodeURIComponent(email)}`);
        }
    }

    useEffect(() => {
        console.log("LoginPage token:", token);
        if (token) {
            navigate(routes.NEWSPAGE);
        }
    }, [token, navigate]);

    return(
        <div>
            <form
            onSubmit={handleLoginSubmit}>
                <h1>Login Page</h1>
                <label>
                    Email:
                    <input type="text"
                           name="email"
                           required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password"
                           name="password"
                           required
                    />
                </label>
                <br />
                <button
                    type="submit"
                    id="login-button"
                >Login</button>
            </form>
            <Link to={routes.REGISTER}>
                <button>Register</button>
            </Link>
        </div>
    )
}
//iz nekog razlgga user moze nako sta istekne access token idalje pristupat rutama, vjerojatno zato sta su u pitanju route i onda se one vec renderaju