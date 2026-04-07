import { useNavigate } from "react-router-dom";
import { type Subject } from "../constants";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../hooks";
import {getAllSubjects, getSubjByName, updateToken} from "../services";
import { SubjectCard } from "../components";
import '../index.css'
import {useDebounce} from "../hooks";

export const SubjectPage = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm);
    const [ascending, setAscending] = useState(true);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

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
        const fetchSearchedSubjects = async () => {
            setPage(1);
            if (!debouncedSearchTerm) {
                setLoading(true);
                try {
                    token = await updateToken(token!, login, logout, navigate, []);
                    const res = await getAllSubjects(token);
                    if (res?.data){
                        const sorted = handleSort(ascending, res.data);
                        setSubjects(sorted);
                    }
                    else setSubjects([]);
                } catch (err) {
                    console.error(err);
                    setSubjects([]);
                } finally {
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            try {
                token = await updateToken(token!, login, logout, navigate, []);
                const res = await getSubjByName(debouncedSearchTerm, token);
                if (res?.status === 200) {
                    setSubjects(res.data);
                } else {
                    setSubjects([]);
                }
            } catch (err) {
                console.error(err);
                setSubjects([]);
            } finally {
                setLoading(false);
            }
        };

        void fetchSearchedSubjects();
    }, [debouncedSearchTerm,ascending]);

    const pageCount = Math.max(1, Math.ceil(subjects.length / 4));
    if (page > pageCount) setPage(pageCount);

    const pageCards = useMemo(() => {
        const start = (page - 1) * 4; 
        return subjects.slice(start, start + 4);
    }, [subjects, page]);

    return (
        <div className="subject-page">
            <h1 className="page-title">Explore Subjects</h1>

            <div className="subject-controls">
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button
                        className="search-button"
                        aria-label="Search"
                    >
                        🔍
                    </button>
                </div>
                <button
                    className="sort-button"
                    onClick={() => setAscending((prev) => !prev)}
                >
                    {ascending ? "Ascending" : "Descending"}
                </button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : subjects.length === 0 ? (
                <p>No subjects found.</p>
            ) : (
                <div className="subjects-grid">
                    {pageCards.map((subject) => (
                        <SubjectCard key={subject.id} {...subject} />
                    ))}
                </div>
            )}

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
