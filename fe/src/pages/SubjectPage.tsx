import {Link} from "react-router-dom";
import {routes} from "../constants/routes.ts";

export const SubjectPage=()=>{
    return(
        <div>
            <h1>Subject Page</h1>
            <p>This is the subject page.</p>
            <Link to={routes.MATERIALSPAGE}>
                <button>MATERIALSPAGE</button>
            </Link>
            <Link to={routes.NEWSPAGE}>
                <button>NEWSPAGE</button>
            </Link>
            <Link to={routes.PROFESSORPAGE}>
                <button>PROFESSORPAGE</button>
            </Link>
            <Link to={routes.ADMINSETTINGSPAGE}>
                <button>ADMINSETTINGSPAGE</button>
            </Link>
        </div>
    )
}