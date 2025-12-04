import {Outlet, Navigate, useLocation} from "react-router-dom";
import {routes} from "../constants/routes.ts";
import {useAuth} from "../hooks";
import {jwtDecode} from "jwt-decode";
import {useEffect, useState} from "react";
import {newAccessToken} from "../services";

export const PrivateRoutesGuard = () => {
    const { token, logout,login,loading } = useAuth();
    const location = useLocation();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    async function refreshToken() {
        const response = await newAccessToken();
        if (response?.status === 201) {
            setIsValid(true);
            login(response.data)
        } else {
            logout();
            setIsValid(false);
            alert('Session expired, please log in again.');
        }
    }

    useEffect(() => {
        if(loading) return;

        if (!token) {
            setIsValid(false);
            return;
        }
        try {
            const decodedToken = jwtDecode(token) as any;
            if (Date.now() >= decodedToken.exp * 1000) {
                void refreshToken();
            } else {
                setIsValid(true);
            }
        } catch {
            logout();
            setIsValid(false);
        }
    }, [token, location, logout,loading]);

    if (loading || isValid === null) return <div>Loading...</div>;
    if (!isValid) return <Navigate to={routes.LOGIN}/>;

    return <Outlet />;
};
//na be dodat da se poprati ovo vrime kad je refresh token crka