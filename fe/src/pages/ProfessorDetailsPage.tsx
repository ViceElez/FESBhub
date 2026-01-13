import { useEffect, useState, useMemo, use} from 'react';
import type {Professor, Subject } from '../constants';
import { routes } from '../constants';
// import {AddProfessorCommentPopup, DeleteProfessorCommentPopup, UpdateProfessorCommentPopup, CPCardNormal} from "../components/index";
// import {jwtDecode} from "jwt-decode";
import {ProfessorCard} from '../components'
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../hooks";
import {getAllProfessors, updateToken, getAllSubjects} from "../services";
import { useParams } from 'react-router-dom';
import '../index.css';
import '../styles/ProfessorCardStyle.css';
import '../styles/ProfessorDetailsPageStyle.css';

export const ProfessorDetailsPage = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    let {token, login, logout} = useAuth();
    const navigate = useNavigate();

    const {professorId} = useParams<{professorId: string}>();
    // console.log("Professor ID from params:", id);

    useEffect(() => {
        // console.log("Fetching details for professor ID:", id);
        if (!professorId) return;
        const fetchProfessor = async () => {
            try{
                token = await updateToken(token!, login, logout, navigate, []);
                const response = await getAllProfessors(token)
                const found = response?.data.find((prof: Professor) => prof.id === Number(professorId)); 
                setProfessors(found ? [found] : []);

                const subjectResponse = await getAllSubjects(token);
                const mappedSubjects: Subject[] = subjectResponse?.data.map((subj: any) => ({
                    id: subj.id,
                    title: subj.title,
                    lecturerId: subj.idNositelja,
                    assistentId: subj.idAuditornih,
                    ratingExpectations: subj.ratingExpectations,
                    ratingPracticality: subj.ratingPracticality,
                    ratingDifficulty: subj.ratingDifficulty,
                }));

                setSubjects(mappedSubjects.filter((subj) => subj.lecturerId === Number(professorId) || subj.assistentId === Number(professorId)));
            }catch(error){
                console.error("Error fetching professors:", error);
            }
        };
        void fetchProfessor();
    }, [professorId]);

    return (
        <div className ="professor-details-page">
            <nav className = "professor-nav">
                <Link to={routes.NEWSPAGE}>
                    <button>NEWSPAGE</button>
                </Link>
                <Link to={routes.SUBJECTPAGE}>
                    <button>SUBJECTPAGE</button>
                </Link>
                <Link to={routes.PROFESSORPAGE}>
                    <button>PROFESSORPAGE</button>
                </Link>
                <Link to={routes.MATERIALSPAGE}>
                    <button>MATERIALS</button>
                </Link>
                <Link to={routes.ADMINSETTINGSPAGE}>
                    <button>ADMINSETTINGSPAGE</button>
                </Link>
            </nav>
            <h1 className = "page-title">Professor Details Page</h1>
            <div className = "professor-details-container">
                {professors.map((prof) => (
                    <div key={prof.id} className = "professor-details-card">
                        <ProfessorCard prof={{...prof, subjects}} profId={prof.id} showDetails = {true} />
                    </div>
                ))}
            </div>
        </div>
    )
}