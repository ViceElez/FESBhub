import {Link} from "react-router-dom";
import {routes} from "../constants/routes.ts";

export const MaterialsPage=()=>{
    return(
        <div>
            <h1>Materials Page</h1>
            <p>This is the materials page.</p>
            <Link to={routes.NEWSPAGE}>
                <button>NEWSPAGE</button>
            </Link>
            <Link to={routes.SUBJECTPAGE}>
                <button>SUBJECTPAGE</button>
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