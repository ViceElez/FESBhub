import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks";
import {useState} from "react";
import {updateToken} from "../services";
import '../index.css';
import {AdminPostVerify, AdminProfessorComments, AdminSubjectComments} from '../components'

type VerifyContentView =
    | 'posts'
    | 'professorComments'
    | 'subjectComments'
    | null;

export const AdminSettingsVerifyContentTab = () => {
    const navigate = useNavigate();
    let { token, login, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<VerifyContentView>(null);


    const setPostsView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setActiveTab('posts');
    }
    const setProfCommentsView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setActiveTab('professorComments');
    }
    const setSubjCommentsView = async () => {
        token= await updateToken(token!, login, logout, navigate, []);
        setActiveTab('subjectComments');
    }


  return (
    <div>
        <div className="admin-tabs">
            <button
                className={activeTab === 'posts' ? 'active' : ''}
                onClick={setPostsView}
            >
                Posts
            </button>
            <button
                className={activeTab === 'professorComments' ? 'active' : ''}
                onClick={setProfCommentsView}
            >
                Professor Comments
            </button>
            <button
                className={activeTab === 'subjectComments' ? 'active' : ''}
                onClick={setSubjCommentsView}
            >
                Subject Comments
            </button>
        </div>

        <div>
            {activeTab === 'posts' && <AdminPostVerify/>}
            {activeTab === 'professorComments' && <AdminProfessorComments/>}
            {activeTab === 'subjectComments' && <AdminSubjectComments/>}
        </div>
    </div>
  );
}