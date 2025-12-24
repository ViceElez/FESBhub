import { useEffect, useState, useMemo} from 'react';
import type { Professor } from '../constants';
import {ProfessorCard} from '../components'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken } from "../services/updateToken.ts";
import axios from "axios";
import { Link } from "react-router-dom";
import { routes } from '../constants/routes.ts';

export const ProfessorPage = () => {

    const [professors, setProfessors] = useState<Professor[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProfessors = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            axios.get<Professor[]>("http://localhost:3000/prof",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then(response => {
                setProfessors(response.data);
            })
        };
        void fetchProfessors();
    }, []);

    const [page, setPage] = useState(1);
    const pageCount = Math.max(1, Math.ceil(professors.length / 12));

    if (page > pageCount) setPage(pageCount);

    const pageCards = useMemo(() => {
        const start = (page - 1) * 12;
        return professors.slice(start, start + 12);
    }, [professors, page]);


    return(
        <div>
            <Link to={routes.NEWSPAGE}>
                <button>NEWSPAGE</button>
            </Link>
            <Link to={routes.SUBJECTPAGE}>
                <button>SUBJECTPAGE</button>
            </Link>
            <Link to={routes.MATERIALSPAGE}>
                <button>MATERIALS</button>
            </Link>
            <Link to={routes.ADMINSETTINGSPAGE}>
                <button>ADMINSETTINGSPAGE</button>
            </Link>
            <h1>Professor Page</h1>
            <p>This is the professor page.</p>
            <div
                style = {{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {pageCards.map(professor => (
                    <div key={professor.id}>
                        <ProfessorCard prof = {professor} profId = {professor.id}/>
                    </div>
                ))}
            </div>
            <div className="pages" style={{ marginTop: "20px", textAlign: "center" }}>
                <button onClick={() => setPage(1)} disabled={page === 1}>
                « First
                </button>
                <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                ‹ Prev
                </button>

                <span style={{ padding: "0 8px" }}>
                Page {page} / {pageCount}
                </span>

                <button onClick={() => setPage((p) => p + 1)} disabled={page === pageCount}>
                Next ›
                </button>
                <button onClick={() => setPage(pageCount)} disabled={page === pageCount}>
                Last »
                </button>
            </div>
        </div>
    )
}

