import {loginApi} from "../services";
import {Link, useNavigate} from "react-router-dom";
import {routes} from "../constants";
import {useAuth} from "../hooks";
import {useEffect} from "react";
import '../index.css';

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
        if (token) {
            navigate(routes.NEWSPAGE);
        }
    }, [token, navigate]);

    return (
        <div className="loginPageBody">
            <div className="loginPageWrapper">
                <header>
                    <p>Prijavite se</p>
                </header>

                <form
                    onSubmit={handleLoginSubmit}
                >
                    <div>
                        <label htmlFor="email">Email</label>
                        <br />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="vas@email.hr"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Lozinka</label>
                        <br />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Unesite lozinku"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="remember">
                            <input id="remember" name="remember" type="checkbox" /> Zapamti me
                        </label>
                        <a href="#">Zaboravili ste lozinku?</a>
                    </div>

                    <div>
                        <button
                            type="submit"
                            id="login-button"
                        >Prijava</button>
                    </div>

                    <p>
                        Nemate račun? <Link to={routes.REGISTER}>Registrirajte se</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}