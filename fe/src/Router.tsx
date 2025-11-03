import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './constants/routes';
import {
    LoginPage,
    RegisterPage,
    NewsPage,
    MaterialsPage,
    SubjectPage,
    ProfessorPage,
    AdminSettingsPage,
    NoPageFound,
    VerifyEmailPage,
    PrivateRoutes
} from "./pages";

export const Router =()=> {
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path={routes.NEWSPAGE} element={<NewsPage />} />
                    <Route path={routes.MATERIALSPAGE} element={<MaterialsPage />} />
                    <Route path={routes.SUBJECTPAGE} element={<SubjectPage />} />
                    <Route path={routes.PROFESSORPAGE} element={<ProfessorPage />} />
                    <Route path={routes.ADMINSETTINGSPAGE} element={<AdminSettingsPage />} />
                    <Route path={routes.NO_PAGE_FOUND} element={<NoPageFound />} />
                </Route>
                <Route path={routes.LOGIN} element={<LoginPage />} />
                <Route path={routes.REGISTER} element={<RegisterPage />} />
                <Route path={routes.VERIFYEMAILPAGE} element={<VerifyEmailPage />} />
            </Routes>
        </BrowserRouter>
    )
}