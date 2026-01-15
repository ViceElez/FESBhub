import { logoutApi } from "../services";
import { routes } from "../constants/routes.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export const Header = () => {
    const navigate = useNavigate();
    const { token, logout } = useAuth();

    const handleLogoutClick = async () => {
        const response = await logoutApi(token);
        if (response?.status === 201) {
            alert("Logout successful!");
            logout();
            navigate(routes.LOGIN);
        }
    };

    const handleSettingsClick = () => {
        navigate(`${routes.USERSETTINGSPAGE}?tab=profile`);
    };

    return (
        <header className="app-header">
            <div className="header-inner">
                <div />
                <h1 className="header-title">FESBHub</h1>
                <div className="header-actions">
                    <button id="logout-button" onClick={handleLogoutClick}>
                        Logout
                    </button>
                    <button id="settings-button" onClick={handleSettingsClick}>
                        Settings
                    </button>
                </div>
            </div>
        </header>
    );
};