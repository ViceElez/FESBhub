import { useEffect, useState, useMemo} from 'react';
import type { Professor } from '../constants';
import { routes } from '../constants';
import {ProfessorCard} from '../components'
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../hooks";
import {getAllProfessors, updateToken} from "../services";
import '../index.css';
import '../styles/ProfessorCard.css';

export const ProfessorPage = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [ascending, setAscending] = useState(true);
    
    useEffect(() => {
        const fetchProfessors = async () => {
            try{
                token= await updateToken(token!, login, logout, navigate, []);
                const response=await getAllProfessors(token)
                setProfessors(response?.data)
            }catch(error){
                console.error("Error fetching professors:", error);
            }
            setProfessors((list) =>
                [...list].sort((a, b) =>
                    ascending ? a.rating - b.rating : b.rating - a.rating
                )
            );
        };
        void fetchProfessors();
    }, []);

    const [page, setPage] = useState(1);
    const pageCount = Math.max(1, Math.ceil(professors.filter(
        (professor) => professor.firstName.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        || professor.lastName.toLowerCase().includes(searchTerm.toLocaleLowerCase()))
        .length / 12));

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
            <div>
                <input
                    type="text"
                    placeholder="Search professors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() =>
                        setAscending((prev) => {
                            const newAsc = !prev;
                            setProfessors((list) =>
                                [...list].sort((a, b) =>
                                    prev ? a.rating - b.rating : b.rating - a.rating
                                )
                            );
                            return newAsc;
                        })
                    }
                >
                    {ascending ? "Ascending" : "Descending"}
                </button>
            </div>
            <div
                style = {{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {pageCards.filter((professor) => 
                    professor.firstName.toLowerCase().includes(searchTerm.toLowerCase())
                    || professor.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(professor => (
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

