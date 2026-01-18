import { useNavigate } from "react-router-dom";
import { useAuth, useDebounce } from "../hooks";
import { useEffect, useState } from "react";
import {
    deleteProfessorById,
    getAllProfessors,
    getProfessorByName,
    updateToken,
} from "../services";
import "../index.css";
import { AdminSettingProfessorTabComments } from "../components";

type Professor = {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
    education: string;
    email: string;
    rating: number;
    comments: [];
    subjectsAsAuditor: [];
    subjectsAsNositelj: [];
};

export const AdminSettingsProfessorTab = () => {
    const navigate = useNavigate();
    let { token, login, logout } = useAuth();

    const [shownProfessors, setShownProfessors] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedProf, setSelectedProf] = useState<Professor | null>(null);

    useEffect(() => {
        const fetchProfessors = async () => {
            if (!debouncedSearchTerm) {
                setLoading(true);
                try {
                    token = await updateToken(token!, login, logout, navigate, []);
                    const res = await getAllProfessors(token);
                    if (res?.status === 200) {
                        setShownProfessors(res.data);
                    }
                } finally {
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            try {
                token = await updateToken(token!, login, logout, navigate, []);
                const res = await getProfessorByName(debouncedSearchTerm, token);
                if (res?.status === 200) {
                    setShownProfessors(res.data);
                } else {
                    setShownProfessors([]);
                }
            } catch {
                setShownProfessors([]);
            } finally {
                setLoading(false);
            }
        };

        void fetchProfessors();
    }, [debouncedSearchTerm]);

    const handleDelete = async (professorId: number) => {
        token = await updateToken(token!, login, logout, navigate, []);
        if (
            !confirm(
                "Are you sure you want to delete this professor? This action cannot be undone."
            )
        )
            return;

        const res = await deleteProfessorById(professorId, token);
        if (res?.status === 200) {
            setShownProfessors(prev => prev.filter(p => p.id !== professorId));
            alert("Professor deleted successfully.");
        }
    };

    const handleViewComments = async (professor: Professor) => {
        token = await updateToken(token!, login, logout, navigate, []);
        setSelectedProf(professor);
        setIsVisible(true);
    };

    return (
        <div>
            <div className="user-search-wrapper">
                <input
                    type="text"
                    placeholder="Search professors..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="user-search-input"
                />
            </div>

            <div className="admin-professors-container">
                {loading && <p className="loading-text">Loading professors...</p>}

                {!loading &&
                    shownProfessors.map(professor => (
                        <div
                            key={professor.id}
                            className="admin-professor-card"
                        >
                            <h2 className="admin-professor-name">
                                {professor.firstName} {professor.lastName} –
                                <span className="admin-professor-email">
                                    {" "}
                                    {professor.email}
                                </span>
                            </h2>

                            <p className="admin-professor-specialization">
                                Specialization: {professor.specialization}
                            </p>
                            <p className="admin-professor-education">
                                Education: {professor.education}
                            </p>
                            <p className="admin-professor-rating">
                                Rating: {professor.rating.toFixed(2)}
                            </p>

                            <button
                                className="admin-professor-delete-btn"
                                onClick={() => handleDelete(professor.id)}
                            >
                                Delete
                            </button>

                            <button
                                className="admin-professor-comments-btn"
                                onClick={() =>
                                    handleViewComments(professor)
                                }
                            >
                                View Comments
                            </button>
                        </div>
                    ))}

                {!loading && shownProfessors.length === 0 && (
                    <p>No professors found.</p>
                )}
            </div>

            {selectedProf && (
                <AdminSettingProfessorTabComments
                    open={isVisible}
                    professor={selectedProf}
                    close={() => {
                        setIsVisible(false);
                        setSelectedProf(null);
                    }}
                />
            )}
        </div>
    );
};
