import { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import { getSubjById, updateToken } from "../services";
import { createPortal } from "react-dom";

interface SubjectDetailsProps {
    subjectId: number;
    onClose: () => void;
}

export const SubjectDetails = ({ subjectId, onClose }: SubjectDetailsProps) => {
    const [subject, setSubject] = useState<any | null>(null);
    let { token, login, logout } = useAuth();

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.classList.add("subject-details-modal-body-open");
        return () => document.body.classList.remove("subject-details-modal-body-open");
    }, []);

    // Fetch subject details
    useEffect(() => {
        const fetchSubject = async () => {
            try {
                token = await updateToken(token!, login, logout, () => {}, []);
                const res = await getSubjById(subjectId, token);
                if (res?.status === 200) {
                    const subj = {
                        id: res.data.id,
                        title: res.data.title,
                        ratingExpectations: res.data.ratingExpectations,
                        ratingPracticality: res.data.ratingPracticality,
                        ratingDifficulty: res.data.ratingDifficulty,
                        nositelj: res.data.nositelj
                            ? {
                                id: res.data.nositelj.id,
                                firstName: res.data.nositelj.firstName,
                                lastName: res.data.nositelj.lastName,
                            }
                            : null,
                        auditorne: res.data.auditorne
                            ? {
                                id: res.data.auditorne.id,
                                firstName: res.data.auditorne.firstName,
                                lastName: res.data.auditorne.lastName,
                            }
                            : null,
                    };
                    setSubject(subj);
                }
            } catch (error) {
                console.error("Error fetching subject:", error);
            }
        };
        void fetchSubject();
    }, [subjectId]);

    if (!subject) {
        return createPortal(
            <div className="subject-details-modal-overlay">
                <p className="subject-details-modal-loading">Loading subject...</p>
            </div>,
            document.body
        );
    }

    return createPortal(
        <div
            className="subject-details-modal-overlay"
            onClick={onClose}
        >
            <div
                className="subject-details-modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="subject-details-modal-close-button"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2 className="subject-details-modal-title">{subject.title}</h2>

                <div className="subject-details-modal-ratings">
                    <p className="subject-details-modal-rating-expectations">
                        Ocjena očekivanja: {subject.ratingExpectations}
                    </p>
                    <p className="subject-details-modal-rating-practicality">
                        Ocjena praktičnosti: {subject.ratingPracticality}
                    </p>
                    <p className="subject-details-modal-rating-difficulty">
                        Ocjena težine: {subject.ratingDifficulty}
                    </p>
                </div>

                <div className="subject-details-modal-personnel">
                    <p className="subject-details-modal-nositelj">
                        Nositelj:{" "}
                        {subject.nositelj
                            ? `${subject.nositelj.firstName} ${subject.nositelj.lastName}`
                            : "Nema nositelja"}
                    </p>
                    <p className="subject-details-modal-auditorne">
                        Auditorne:{" "}
                        {subject.auditorne
                            ? `${subject.auditorne.firstName} ${subject.auditorne.lastName}`
                            : "Nema osobe za auditorne vježbe"}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
};
