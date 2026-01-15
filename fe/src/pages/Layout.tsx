import { Header } from "../components";
import { Outlet } from "react-router-dom";

export const Layout = () => {
    return (
        <div className="app">
            <Header />
            <main className="app-main">
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};