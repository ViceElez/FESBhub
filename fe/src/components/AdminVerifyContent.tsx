import {ShowUnverifiedProfComments} from "./UnverifiedProfessorComments.tsx";
import {useState} from "react";

export const AdminVerifyContent = () => {
    const [CommentsProf, setCommentsProf] = useState(false);
  return (
    <div>
      <h2>Admin Verify Content</h2>
        <button
            onClick = {() => setCommentsProf(!CommentsProf)}
        >
            Professor Comments
        </button>
        <ShowUnverifiedProfComments show = {CommentsProf}/>
    </div>
  );
}