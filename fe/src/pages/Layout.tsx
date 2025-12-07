import {Fragment} from "react";
import {Header} from "../components";
import {Outlet} from "react-router-dom";

export const Layout=()=>{
    return(
        <div>
            <Fragment>
                <Header/>
                <main>
                    <Outlet />
                </main>
            </Fragment>
        </div>
    )
}