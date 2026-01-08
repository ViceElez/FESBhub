import { Link } from "react-router-dom";
import { routes } from "../constants";
import type { Subject } from "../constants";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { getAllSubjects, updateToken } from "../services";
import { SubjectCard } from "../components";
import '../index.css'

export const SubjectPage = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [ascending, setAscending] = useState(true);
    const [page, setPage] = useState(1);

    const { token: authToken, login, logout } = useAuth();
    const navigate = useNavigate();
    let token = authToken;

    const rating = (d: number, e: number, p: number) => (d + e + p) / 3;

    const handleSort = (direction: boolean, list: Subject[]) => {
        return [...list].sort((a, b) =>
            direction
                ? rating(a.ratingDifficulty, a.ratingExpectations, a.ratingPracticality) -
                rating(b.ratingDifficulty, b.ratingExpectations, b.ratingPracticality)
                : rating(b.ratingDifficulty, b.ratingExpectations, b.ratingPracticality) -
                rating(a.ratingDifficulty, a.ratingExpectations, a.ratingPracticality)
        );
    };

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                token = await updateToken(token!, login, logout, navigate, []);
                const response = await getAllSubjects(token);
                if (response?.data) {
                    const sorted = handleSort(ascending, response.data);
                    setSubjects(sorted);
                }
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };
        void fetchSubjects();
    }, []);

    const filteredSubjects = subjects.filter((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.max(1, Math.ceil(filteredSubjects.length / 12));
    if (page > pageCount) setPage(pageCount);

    const pageCards = useMemo(() => {
        const start = (page - 1) * 12;
        return filteredSubjects.slice(start, start + 12);
    }, [filteredSubjects, page]);

    return (
        <div className="subject-page">
            <nav className="subject-nav">
                <Link to={routes.MATERIALSPAGE}>
                    <button>MATERIALS</button>
                </Link>
                <Link to={routes.NEWSPAGE}>
                    <button>NEWS</button>
                </Link>
                <Link to={routes.PROFESSORPAGE}>
                    <button>PROFESSORS</button>
                </Link>
                <Link to={routes.ADMINSETTINGSPAGE}>
                    <button>ADMIN</button>
                </Link>
            </nav>

            <h1 className="page-title">Explore Subjects</h1>

            <div className="subject-controls">
                <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button
                    className="sort-button"
                    onClick={() => setAscending((prev) => !prev)}
                >
                    {ascending ? "Ascending" : "Descending"}
                </button>
            </div>

            <div className="subjects-grid">
                {pageCards.map((subject) => (
                    <SubjectCard key={subject.id} {...subject} />
                ))}
            </div>

            <div className="pagination">
                <button onClick={() => setPage(1)} disabled={page === 1}>
                    « First
                </button>
                <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                    ‹ Prev
                </button>
                <span>
          Page {page} / {pageCount}
        </span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === pageCount}
                >
                    Next ›
                </button>
                <button onClick={() => setPage(pageCount)} disabled={page === pageCount}>
                    Last »
                </button>
            </div>
        </div>
    );
};
