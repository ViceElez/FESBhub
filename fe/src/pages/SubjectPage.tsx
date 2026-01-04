import {Link} from "react-router-dom";
import {routes} from "../constants";
import type {Subject} from "../constants";
import { useEffect, useState, useMemo} from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import {getAllSubjects, updateToken} from "../services";
import { SubjectCard } from "../components";
import '../index.css';

export const SubjectPage=()=>{

    const [subjects, setSubjects] = useState<Subject[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [ascending, setAscending] = useState(true);

    const rating = (d: number, e: number, p: number) => {
        return (d + e + p) / 3;
    };

    const handleSort = (direction: boolean) => {
        setSubjects((list) =>
            [...list].sort((a, b) =>
                direction ?
                    rating(a.ratingDifficulty, a.ratingExpectations, a.ratingPracticality) - 
                    rating(b.ratingDifficulty, b.ratingExpectations, b.ratingPracticality) :
                    rating(b.ratingDifficulty, b.ratingExpectations, b.ratingPracticality) - 
                    rating(a.ratingDifficulty, a.ratingExpectations, a.ratingPracticality)
            )
        );
    }

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                token = await updateToken(token!, login, logout, navigate, []);
                const response = await getAllSubjects(token)
                setSubjects(response?.data);

            }catch(error){
                console.error("Error fetching subjects:", error);
            }
            handleSort(ascending);
        };
        void fetchSubjects();
    }, []);

    const [page, setPage] = useState(1);
        const pageCount = Math.max(1, Math.ceil(subjects.filter(subject => {
            subject.title.toLowerCase().includes(searchTerm.toLowerCase())
        }).length / 12));
    
        if (page > pageCount) setPage(pageCount);
    
        const pageCards = useMemo(() => {
            const start = (page - 1) * 12;
            return subjects.slice(start, start + 12);
        }, [subjects, page]);

    return(
        <div>
            <Link to={routes.MATERIALSPAGE}>
                <button>MATERIALSPAGE</button>
            </Link>
            <Link to={routes.NEWSPAGE}>
                <button>NEWSPAGE</button>
            </Link>
            <Link to={routes.PROFESSORPAGE}>
                <button>PROFESSORPAGE</button>
            </Link>
            <Link to={routes.ADMINSETTINGSPAGE}>
                <button>ADMINSETTINGSPAGE</button>
            </Link>
            <h1>Subject Page</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() =>
                        setAscending((prev) => {
                            const newAsc = !prev;
                            handleSort(prev);
                            return newAsc;
                        })
                    }
                >
                    {ascending ? "Ascending" : "Descending"}
                </button>
            </div>
            <div
                style = {{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {//ovde i za profesore triba popravit sta ovo dohvaca samo predmete i profesorce 
                // koji su na toj stranici jer uzima pageCards
                pageCards.filter(subject =>
                    subject.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(subject => (
                    <div key={subject.id}>
                        <SubjectCard {...subject}/>
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

