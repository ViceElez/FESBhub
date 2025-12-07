import {Outlet, Navigate, useLocation} from "react-router-dom";
import {routes} from "../constants/routes.ts";
import {useAuth} from "../hooks";
import {useEffect, useState} from "react";
import {newAccessToken, tokenIsExpired} from "../services";

export const PrivateRoutesGuard = () => {
    const { token, logout,login,loading } = useAuth();
    const location = useLocation();
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const expired = token ? tokenIsExpired(token) : true;

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
            if (expired) {
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