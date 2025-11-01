import {loginApi} from "../services";
import {Link} from "react-router-dom";
import {routes} from "../constants/routes.ts";

export const LoginPage =()=>{
    const handleLoginSubmit=async(event:any)=>{
        event.preventDefault();
        const formData=new FormData(event.target);
        const email=formData.get('email') as string;
        const password=formData.get('password') as string;
        const response= await loginApi(email,password)
        console.log('this is from react',response?.data);
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
                <button type="submit">Login</button>
            </form>
            <Link to={routes.REGISTER}>
                <button>Register</button>
            </Link>
        </div>
    )
}