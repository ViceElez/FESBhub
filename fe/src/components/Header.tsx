import {logoutApi, tokenIsAdmin,updateToken} from "../services";
import {routes} from "../constants";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";
import '../index.css'
import logo from '../assets/images/FESBhubLogo.png'

export const Header = () => {
    const navigate=useNavigate();
    let {token,logout,login}=useAuth()

    const handleLogoutClick=async()=>{
        token=await updateToken(token!, login, logout, navigate, []);
        const response=await logoutApi(token);
        if(response?.status===201){
            alert('Logout successful!');
            logout();
            navigate(routes.LOGIN);
        }
    }
    const handleSettingsClick=async ()=>{
        token=await updateToken(token!, login, logout, navigate, []);
        if(!token){
            navigate(routes.LOGIN)
            return
        }
        const isAdmin=await tokenIsAdmin(token);
        navigate(isAdmin ? routes.ADMINSETTINGSPAGE : routes.USERSETTINGSPAGE);

    }


    return (
        <header className="app-header">
            <div className="spacer">
                <button>Light/Dark</button>
            </div>
            <img src={logo} alt="FesbHub Logo"
            onClick={()=> 
                navigate(routes.NEWSPAGE)
            }
            style={{cursor:"grab"}}/>
            <div>
                <button
                    id="logout-button"
                    onClick={handleLogoutClick}
                >⏻ Logout</button>
                <button
                    id="settings-button"
                    onClick={handleSettingsClick}
                >⚙️ Settings</button>
            </div>
        </header>
    );
};