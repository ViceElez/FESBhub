import {useState} from "react";
import {registerApi} from "../services";
import {Link, useNavigate} from "react-router-dom";
import {routes} from "../constants/routes.ts";

export const RegisterPage=()=>{
    const studies=["Racunarstvo","Elektrotehnika","Strojarstvo","Brodogradnja","Necu Reci"];
    const [study,setStudy]=useState(studies[0]);

    const studyYear=["1","2","3","4","5","Necu reci"];
    const [year,setYear]=useState(studyYear[0]);
    const navigate=useNavigate()

    const handleRegisterSubmit=async(event:any)=>{
        event.preventDefault();
        const formData=new FormData(event.target);
        const email=formData.get("email") as string;
        const password=formData.get("password") as string;
        const firstName=formData.get("firstName") as string;
        const lastName=formData.get("lastName") as string;
        const response=await registerApi(email,password,firstName,study,year,lastName);
        if(response?.status===201){
            alert('Registration successful! Please verify your email.');
            navigate(`${routes.VERIFYEMAILPAGE}?email=${encodeURIComponent(email)}`);
        }
    }
    return (
        <div className="registerPageBody">
            <div className="registerPageWrapper">
                <header>
                    <p>Registracija</p>
                </header>

                <form
                    onSubmit={handleRegisterSubmit}
                >
                    <div>
                        <label htmlFor="email">Email</label>
                        <br />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="vas@email.hr"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Lozinka</label>
                        <br />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Unesite lozinku"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword">Potvrdite lozinku</label>
                        <br />
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Ponovo unesite lozinku"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="firstName">Ime</label>
                        <br />
                        <input
                            id="username"
                            name="firstName"
                            type="text"
                            placeholder="Unesite korisničko ime"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName">Prezime</label>
                        <br />
                        <input
                            id="username"
                            name="lastName"
                            type="text"
                            placeholder="Unesite korisničko ime"
                            required
                        />
                    </div>

                    <div>
                        <label>Choose a Studij:</label>
                        <select name="study" value={study} onChange={(e) => setStudy(e.target.value)} >
                            {studies.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Choose a Year:</label>
                        <select name="year" value={year} onChange={(e) => setYear(e.target.value)} >
                            {studyYear.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            id="register-button"
                        >Registriraj se</button>
                    </div>

                    <p>
                        Već imate račun? <Link to={routes.LOGIN}>Prijavite se</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}