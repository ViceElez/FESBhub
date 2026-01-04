import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";
import {useEffect, useState} from "react";
import { getAllProfessors, updateToken} from "../services";

type Professor = {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
    education: string;
    email: string;
    rating: number;
    comments:[];
    subjectsAsAuditor:[];
    subjectsAsNositelj:[];
};

export const AdminSettingsProfessorTab = () => {
    const navigate = useNavigate();
    let { token,login,logout } = useAuth();
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfessors() {
            try {
                token = await updateToken(token!, login, logout, navigate, []);
                const response = await getAllProfessors(token);
                if (response?.status === 200) {
                    const professors: Professor[] = response.data;
                    setProfessors(professors);
                }
            } finally {
                setLoading(false);
            }
        }
        void fetchProfessors();
    }, []);

    const handleDelete = async (professorId: number) => {
        // Implement delete functionality here
        console.log(`Delete professor with ID: ${professorId}`);
    }

    const handleViewComments = async (professorId: number) => {
        // Implement view comments functionality here
        console.log(`View comments for professor with ID: ${professorId}`);
    }

    if (loading) return <p>Loading professors...</p>;

    return (
        <div className="admin-professors-container">
            <h2>All Professors</h2>
            {professors.map(professor => (
                <div key={professor.id} className="admin-professor-card">
                    <h2 className="admin-professor-name">
                        {professor.firstName} {professor.lastName} -
                        <span className="admin-professor-email"> {professor.email}</span>
                    </h2>
                    <p className="admin-professor-specialization">Specialization: {professor.specialization}</p>
                    <p className="admin-professor-education">Education: {professor.education}</p>
                    <p className="admin-professor-rating">Rating: {professor.rating}</p>

                    <button
                        className="admin-professor-delete-btn"
                        onClick={() => handleDelete(professor.id)}
                    >
                        Delete
                    </button>

                    <button
                        className="admin-professor-comments-btn"
                        onClick={() => handleViewComments(professor.id)}
                    >
                        View Comments
                    </button>
                </div>
            ))}

            {professors.length === 0 && <p>No professors found.</p>}
        </div>
    );
}