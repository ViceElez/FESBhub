import type {CardProperties, CommentProfessor,Subject} from "../constants";
import {useState, useEffect} from "react";
import {AddProfessorCommentPopup, DeleteProfessorCommentPopup, UpdateProfessorCommentPopup} from "./index";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../hooks";
import {useNavigate} from "react-router-dom";
import {updateToken,getVerifiedProfessorComments,getProfessorComments} from "../services";
import { CPCardNormal } from "./index";
import { getAllSubjects } from "../services";

const calculateAverageRating = (comments: CommentProfessor[]): number => {
    if (comments.length === 0) return 0;
    const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return total / comments.length;
};

export const ProfessorCard = ({prof, profId, showDetails}: CardProperties) => {

    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)
    let {token,login,logout} = useAuth()
    const decode = token ? jwtDecode(token) : null;
    const userId = decode?.sub;
    const navigate = useNavigate()
    const [existingComment, setExistingComment] = useState(false);
    const [verifiedComments, setVerifiedComments] = useState<CommentProfessor[]>([]);
    const [showVerifiedComments, setShowVerifiedComments] = useState(false);

    useEffect(() => {
        const fetchProfessorComments = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response=await getProfessorComments(profId,token,userId)
            if(response?.status===200)
                setExistingComment(response.data)
            else
                alert('Error')
        }
        void fetchProfessorComments()
    },[]);

    useEffect(() => {
        const fetchVerifiedComments = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const response = await getVerifiedProfessorComments(profId, token);
            if (response?.status === 200) {
                setVerifiedComments(response.data);
            } else {
                alert('Error fetching verified comments');
            }
        };
        void fetchVerifiedComments();
    }, [profId]);

    const renderRatingStars = (rating: number) => {
        const fullStars = Math.round(rating);
        const emptyStars = 5 - fullStars;

        return (
            <>
                {'★'.repeat(fullStars)}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    const averageRating = calculateAverageRating(verifiedComments);


    return (
        <div className="card">
          <img src={prof.imageUrl ? prof.imageUrl : '/default-profile-image.png'} />
          <h2
            onClick={() => navigate(`/professor/${profId}`)}
          >
            {prof.firstName} {prof.lastName}
          </h2>
      
          <p className="rating-stars">
            Ocjena: {verifiedComments.length > 0
              ? <>{renderRatingStars(averageRating)} ({averageRating.toFixed(2)})</>
              : "Nema ocjena"}
          </p>
      
          {showDetails && (
            <>
              <p>Uže područje interesa: {prof.specialization}</p>
              <p>Obrazovanje: {prof.education}</p>
              <p>Email: {prof.email}</p>
              <h4>Predmeti:</h4>
              <ul>
                {prof.subjects && prof.subjects.length > 0
                  ? prof.subjects.map(subject => (
                      <li
                        key={subject.id}
                        onClick={() => navigate(`/subject/${subject.id}`)}
                      >
                        {subject.title}
                      </li>
                    ))
                  : <li>Nema dodanih predmeta</li>}
              </ul>
            </>
          )}
      
          <div className="buttons" style={{ marginBottom: '10px' }}>
            <button className="btn-add"
              disabled={!token || !userId || existingComment}
              onClick={() => { setIsOpenAdd(true); setIsOpenDelete(false); setIsOpenUpdate(false); }}
            >
              Dodaj komentar
            </button>
      
            <button className="btn-delete"
              disabled={!token || !userId || !existingComment}
              onClick={() => { setIsOpenDelete(true); setIsOpenAdd(false); setIsOpenUpdate(false); }}
            >
              Izbriši komentar
            </button>
      
            <button className="btn-update"
              disabled={!token || !userId || !existingComment}
              onClick={() => { setIsOpenUpdate(true); setIsOpenAdd(false); setIsOpenDelete(false); }}
            >
              Izmjeni komentar
            </button>
          </div>
      
          <AddProfessorCommentPopup
            isOpen={isOpenAdd}
            onClose={() => setIsOpenAdd(false)}
            id={profId}
            onSuccess={() => setExistingComment(true)}
          />
      
          <DeleteProfessorCommentPopup
            isOpen={isOpenDelete}
            onClose={() => setIsOpenDelete(false)}
            id={profId}
            onSuccess={() => setExistingComment(false)}
          />
      
          <UpdateProfessorCommentPopup
            isOpen={isOpenUpdate}
            onClose={() => setIsOpenUpdate(false)}
            id={profId}
          />
      
          <div className="professor-card-comments-toggle">
            <button onClick={() => setShowVerifiedComments(!showVerifiedComments)}>
              {showVerifiedComments ? 'Sakrij komentare' : 'Prikaži komentare'}
            </button>
          </div>
      
          <div className="professor-card-comments">
            {verifiedComments.map(comment => (
              <CPCardNormal key={comment.id} comment={comment} show={showVerifiedComments} />
            ))}
          </div>
        </div>
      );
    }      