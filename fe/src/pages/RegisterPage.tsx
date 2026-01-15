import { useState } from "react";
import { registerApi } from "../services";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../constants/routes.ts";

export const RegisterPage = () => {
    const studies = ["Racunarstvo", "Elektrotehnika", "Strojarstvo", "Brodogradnja", "Necu Reci"];
    const [study, setStudy] = useState(studies[0]);

    const studyYear = ["1", "2", "3", "4", "5", "Necu reci"];
    const [year, setYear] = useState(studyYear[0]);

    const navigate = useNavigate();

    const handleRegisterSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;

        const response = await registerApi(email, password, firstName, study, year, lastName);
        if (response?.status === 201) {
            alert("Registration successful! Please verify your email.");
            navigate(`${routes.VERIFYEMAILPAGE}?email=${encodeURIComponent(email)}`);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div>
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Register Page</h1>

                        <label>
                            Email:
                            <input type="text" name="email" required />
                        </label>

                        <br />

                        <label>
                            Password:
                            <input type="password" name="password" required />
                        </label>

                        <br />

                        <label>
                            First Name:
                            <input type="text" name="firstName" required />
                        </label>

                        <br />

                        <label>
                            Last Name:
                            <input type="text" name="lastName" />
                        </label>

                        <br />

                        <label>Choose a Studij:</label>
                        <select name="study" value={study} onChange={(e) => setStudy(e.target.value)}>
                            {studies.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>

                        <br />

                        <label>Choose a Year:</label>
                        <select name="year" value={year} onChange={(e) => setYear(e.target.value)}>
                            {studyYear.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>

                        <br />

                        <button type="submit" id="register-button">
                            Register
                        </button>
                    </form>

                    <Link to={routes.LOGIN}>
                        <button>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};