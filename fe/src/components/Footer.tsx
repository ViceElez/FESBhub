import { Link, useLocation } from "react-router-dom";
import { routes } from "../constants";

export const Footer = () => {
    const location = useLocation();

    const tabs = [
        { name: "News", path: routes.NEWSPAGE },
        { name: "Professors", path: routes.PROFESSORPAGE },
        { name: "Subjects", path: routes.SUBJECTPAGE },
        { name: "Materials", path: routes.MATERIALSPAGE },
    ];

    return (
        <nav className="footer-nav">
            {tabs.map(tab => {
                const isActive = location.pathname === tab.path;
                return (
                    <Link key={tab.path} to={tab.path} className="footer-tab">
                        <button className={`footer-button ${isActive ? "active" : ""}`}>
                            {tab.name}
                        </button>
                    </Link>
                );
            })}
        </nav>
    );
};
