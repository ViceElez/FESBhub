import {Link} from "react-router-dom";
import {routes} from "../constants/routes.ts";


export const NewsPage=()=>{
    return(
        <div>
            <h1>News Page</h1>
            <p>This is the news page.</p>
            <Link to={routes.MATERIALSPAGE}>
                <button>MATERIALSPAGE</button>
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