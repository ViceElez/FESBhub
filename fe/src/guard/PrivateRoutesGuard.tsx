import {Outlet, Navigate, useLocation} from "react-router-dom";
import {routes} from "../constants/routes.ts";
import {useAuth} from "../hooks";
import {jwtDecode} from "jwt-decode";
import {useEffect, useState} from "react";

export const PrivateRoutesGuard = () => {
    const { token, logout } = useAuth();
    const location = useLocation();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        if (!token) {
            setIsValid(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(token) as any;
            if (Date.now() >= decodedToken.exp * 1000) {
                logout();
                setIsValid(false);
            } else {
                setIsValid(true);
            }
        } catch {
            logout();
            setIsValid(false);
        }
    }, [token, location, logout]); // <-- re-runs on route change

    if (isValid === null) return <div>Loading...</div>;
    if (!isValid) return <Navigate to={routes.LOGIN} />;

    return <Outlet />;
};
