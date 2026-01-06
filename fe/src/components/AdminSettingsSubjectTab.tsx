import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";
import {useEffect, useState} from "react";
import {deleteSubjectById, getAllSubjects, updateToken} from "../services";
import '../index.css'
import {AdminSettingSubjectTabComments} from "./AdminSettingSubjectTabComments.tsx";

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
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedSubj, setSelectedSubj] = useState<Subject | null>(null);

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
        token= await updateToken(token!, login, logout, navigate, []);
        if(!confirm('Are you sure you want to delete this subject? This action cannot be undone.')) return;
        const res=await deleteSubjectById(subId,token)
        if(res?.status===200){
            setSubj(prevSubj =>
                prevSubj.filter(s => s.id !== subId)
            );
            alert('Subject deleted successfully.');
        }
    }

    const handleViewComments = async (subj) => {
        token= await updateToken(token!, login, logout, navigate, []);
        setSelectedSubj(subj);
        setIsVisible(true);
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
            {selectedSubj && (
                <AdminSettingSubjectTabComments
                    open={isVisible}
                    subj={selectedSubj}
                    close={() =>{
                        setIsVisible(false);
                        setSelectedSubj(null);
                    }}
                />
            )}
            {subj.length === 0 && <p>No subjects found.</p>}
        </div>
    );
}