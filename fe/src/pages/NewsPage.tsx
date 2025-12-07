import {Link} from "react-router-dom";
import {routes} from "../constants/routes.ts";
import {logoutApi} from "../services";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";


export const NewsPage=()=>{
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

    return(
        <div>
            <h1>News Page</h1>
            <p>This is the news page.</p>
            <Link to={routes.MATERIALSPAGE}>
                <button>MATERIALSPAGE</button>
            </Link>
            <Link to={routes.SUBJECTPAGE}>
                <button>SUBJECTPAGE</button>
            </Link>
            <Link to={routes.PROFESSORPAGE}>
                <button>PROFESSORPAGE</button>
            </Link>
            <Link to={routes.ADMINSETTINGSPAGE}>
                <button>ADMINSETTINGSPAGE</button>
            </Link>
            <button
                id="logout-button"
                onClick={handleLogoutClick}
            >Logout</button>
        </div>
    )
}