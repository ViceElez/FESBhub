import { useEffect, useState, useMemo, use} from 'react';
import type { Professor, Subject } from '../constants';
import { routes } from '../constants';
import {ProfessorCard} from '../components'
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../hooks";
import {getAllProfessors, updateToken, getAllSubjects} from "../services";
import '../index.css';
import '../styles/ProfessorCardStyle.css';
import '../styles/ProfessorPageStyle.css';

export const ProfessorPage = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

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

    useEffect(() => {
        const fetchSubjects = async () => {
            try{
                token= await updateToken(token!, login, logout, navigate, []);
                const response=await getAllSubjects(token)

                interface SubjectFromAPI {
                    id: number;
                    title: string;
                    idNositelja: number;
                    idAuditornih: number;
                    ratingExpectations: number;
                    ratingPracticality: number;
                    ratingDifficulty: number;
                  }
                  
                  const mappedSubjects: Subject[] = response?.data.map((subj: SubjectFromAPI) => ({
                      id: subj.id,
                      title: subj.title,
                      lecturerId: subj.idNositelja,
                      assistentId: subj.idAuditornih,
                      ratingExpectations: subj.ratingExpectations,
                      ratingPracticality: subj.ratingPracticality,
                      ratingDifficulty: subj.ratingDifficulty
                  }));
                  

                setSubjects(mappedSubjects)
            }catch(error){
                console.error("Error fetching subjects:", error);
            }
        };
        void fetchSubjects();
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
        <div className = "professor-page">
            <nav className = "professor-nav">
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
            </nav>
            
            <h1 className = "page-title">Explore Professors</h1>
            <div className = "professor-controls">
                <div className = "search-wrapper">
                    <input
                        type="text"
                        placeholder="Search professors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className = "search-input"
                    />
                    <button 
                        className = "search-button"
                        aria-label = "Search"
                    >
                        🔍
                    </button>
                </div>
                
                <button className = "sort-button"
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
                    .map(professor => {
                        const professorSubjects = subjects.filter((subject : Subject)=>
                            subject.lecturerId === professor.id);
                    return (
                    <div className = "professor-grid" key={professor.id}>
                        <ProfessorCard 
                        prof = {{...professor,
                                subjects: professorSubjects
                        }} 
                        profId = {professor.id}/>
                    </div>
                );
                })}
            </div>
            <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
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

