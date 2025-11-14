import {Outlet,Navigate} from "react-router-dom";
import {routes} from "../constants/routes.ts";
import {useAuth} from "../hooks";

export const PrivateRoutesGuard=()=> {
    const {token}=useAuth();

    return (
        token? <Outlet /> : <Navigate to={routes.LOGIN} />
    );
}