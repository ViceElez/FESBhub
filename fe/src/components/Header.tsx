import {logoutApi, tokenIsAdmin} from "../services";
import {routes} from "../constants/routes.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";

export const Header = () => {
    const navigate=useNavigate();
    const {token,logout}=useAuth()

    const handleLogoutClick=async()=>{
        const response=await logoutApi(token);
        if(response?.status===201){
            alert('Logout successful!');
            logout();
            navigate(routes.LOGIN);
        }
    }
    const handleSettingsClick=async ()=>{
        if(!token){
            navigate(routes.LOGIN)
            return
        }
        const isAdmin=await tokenIsAdmin(token);
        navigate(isAdmin ? routes.ADMINSETTINGSPAGE : routes.USERSETTINGSPAGE);

    }


    return (
        <header>
            <h1>FESBHub</h1>
            <button
                id="logout-button"
                onClick={handleLogoutClick}
            >Logout</button>
            <button
                id="settings-button"
                onClick={handleSettingsClick}
            >Settings</button>
        </header>
    );
}