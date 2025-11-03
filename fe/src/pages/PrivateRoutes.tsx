import {Outlet,Navigate} from "react-router-dom";
import {routes} from "../constants/routes.ts";

export const PrivateRoutes=()=> {
    let authenticated = {'token':true}; //TODO: replace with real authentication logic
    return (
        authenticated.token ? <Outlet /> : <Navigate to={routes.LOGIN} />
    );
}