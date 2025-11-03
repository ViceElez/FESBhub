import {loginApi} from "../services";
import {Link, useNavigate} from "react-router-dom";
import {routes} from "../constants/routes.ts";
import {useAuth} from "../hooks";

export const LoginPage =()=>{
    const {login}=useAuth()
    const navigate=useNavigate()
    const handleLoginSubmit=async(event:any)=>{
        event.preventDefault();
        const formData=new FormData(event.target);
        const email=formData.get('email') as string;
        const password=formData.get('password') as string;
        const response= await loginApi(email,password)
        if(response?.status===201){
            localStorage.setItem("accessToken",response.data.accessToken);
            alert('Login successful!');
            login();
            navigate(routes.NEWSPAGE)
            //odi se ide na hojmepage, ako tria slat jwt u localStorageu je zasad
        }
    }
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