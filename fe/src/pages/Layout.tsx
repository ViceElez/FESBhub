import {Header} from "../components";
import {Outlet} from "react-router-dom";

export const Layout=()=>{
    return(
        <div className="main-container">
            <Header/>
            <main>
                <Outlet />
            </main>
        </div>
    )
}