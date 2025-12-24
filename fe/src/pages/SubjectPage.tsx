import {Link} from "react-router-dom";
import {routes} from "../constants/routes.ts";
import { useEffect, useState, useMemo} from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { updateToken } from "../services/updateToken.ts";
import axios from "axios";
import type {Subject} from "../constants/subjectType.ts";
import { SubjectCard } from "../components/SubjectCard.tsx";

export const SubjectPage=()=>{

    const [subjects, setSubjects] = useState<Subject[]>([]);

    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            axios.get<Subject[]>("http://localhost:3000/subj",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then(response => {
                setSubjects(response.data);
            })
        };
        void fetchSubjects();
    }, []);

    const [page, setPage] = useState(1);
        const pageCount = Math.max(1, Math.ceil(subjects.length / 12));
    
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
            <p>This is the subject page.</p>
            <div
                style = {{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {pageCards.map(subject => (
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

