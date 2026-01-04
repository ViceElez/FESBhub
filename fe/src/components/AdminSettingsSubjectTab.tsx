import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";
import {useEffect, useState} from "react";
import {getAllSubjects, updateToken} from "../services";

type Subject = {
    id: number;
    title: string;
    ratingExpectation: number;
    ratingPractical: number;
    ratingDifficulty: number;
    nositelj: number;
    audtiorne: number;
    comments:[];
}

export const AdminSettingsSubjectTab = () => {

    const navigate = useNavigate();
    let { token,login,logout } = useAuth();
    const [subj, setSubj] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfessors() {
            try {
                token = await updateToken(token!, login, logout, navigate, []);
                const response = await getAllSubjects(token);
                if (response?.status === 200) {
                    const subj: Subject[] = response.data;
                    setSubj(subj);
                }
            } finally {
                setLoading(false);
            }
        }
        void fetchProfessors();
    }, []);

    const handleDelete = async (subId: number) => {
        // Implement delete functionality here
        console.log(`Delete subj with ID: ${subId}`);
    }

    const handleViewComments = async (subId: number) => {
        // Implement view comments functionality here
        console.log(`View comments for subj with ID: ${subId}`);
    }

    if (loading) return <p>Loading professors...</p>;

    return (
        <div className="admin-subjects-container">
            {subj.map(s => (
                <div key={s.id} className="admin-subject-card">
                    <h2 className="admin-subject-title">{s.title}</h2>
                    <p className="admin-subject-meta">Rating Expectation: {s.ratingExpectation}</p>
                    <p className="admin-subject-meta">Rating Practical: {s.ratingPractical}</p>
                    <p className="admin-subject-meta">Rating Difficulty: {s.ratingDifficulty}</p>

                    <button
                        className="admin-subject-delete-btn"
                        onClick={() => handleDelete(s.id)}
                    >
                        Delete
                    </button>

                    <button
                        className="admin-subject-comments-btn"
                        onClick={() => handleViewComments(s.id)}
                    >
                        View Comments
                    </button>
                </div>
            ))}
            {subj.length === 0 && <p>No subjects found.</p>}
        </div>
    );

} //triba u prismi napravit kad se fetchaju svi subj i prof da se saom povucu i njigovi predmeti/profesori, a za ovo komntare samo kad se stisne povuc sve kometnare za tog profa/subj