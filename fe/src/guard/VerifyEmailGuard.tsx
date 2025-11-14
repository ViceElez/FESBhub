import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Outlet } from "react-router-dom";
import axios from "axios";
import { routes } from "../constants/routes";

export const VerifyEmailGuard = () => {
    const [isAllowed, setAllowed] = useState<boolean | null>(null);
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    const navigate = useNavigate();
    const api = "http://localhost:3000";

    useEffect(() => {
        (async () => {
            if (!email) {
                setAllowed(false);
                return;
            }
            try {
                const res = await axios.get(`${api}/email/email-exists`, {
                    params: { email }
                });
                setAllowed(Boolean(res.data?.exists));
            } catch {
                setAllowed(false);
            }
        })();
    }, [email]);

    useEffect(() => {
        if(isAllowed===false){
            navigate(routes.REGISTER);
        }
    }, [isAllowed,navigate]);

    if (isAllowed === null) {
        return <div>Loading...</div>;
    }
    return <Outlet />;
};
