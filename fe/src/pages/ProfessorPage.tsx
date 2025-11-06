import {Link} from "react-router-dom";
import {routes} from "../constants/routes.ts";

export const ProfessorPage=()=>{
    return(
        <div>
            <h1>Professor Page</h1>
            <p>This is the professor page.</p>
            <Link to={routes.NEWSPAGE}>
                <button>NEWSPAGE</button>
            </Link>
            <Link to={routes.SUBJECTPAGE}>
                <button>SUBJECTPAGE</button>
            </Link>
            <Link to={routes.MATERIALSPAGE}>
                <button>MATERIALSPAGE</button>
            </Link>
            <Link to={routes.ADMINSETTINGSPAGE}>
                <button>ADMINSETTINGSPAGE</button>
            </Link>
        </div>
    )
}