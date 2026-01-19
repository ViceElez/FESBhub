import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {routes} from './constants';
import {
    LoginPage,
    RegisterPage,
    NewsPage,
    MaterialsPage,
    SubjectPage,
    ProfessorPage,
    ProfessorDetailsPage,
    AdminSettingsPage,
    NoPageFound,
    VerifyEmailPage,
    Layout,
    UserSettingsPage
} from "./pages";
import {PrivateRoutesGuard, VerifyEmailGuard} from './guard';
import {AuthProvider} from "./context";

export const Router = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={routes.LOGIN} element={<LoginPage/>}/>
                    <Route path={routes.REGISTER} element={<RegisterPage/>}/>
                    <Route path={routes.NO_PAGE_FOUND} element={<NoPageFound/>}/>
                    <Route element={<VerifyEmailGuard/>}>
                        <Route path={routes.VERIFYEMAILPAGE} element={<VerifyEmailPage/>}/>
                    </Route>
                    <Route element={<PrivateRoutesGuard/>}>
                        <Route element={<Layout/>}>
                            <Route path={routes.NEWSPAGE} element={<NewsPage/>}/>
                            <Route path={routes.MATERIALSPAGE} element={<MaterialsPage/>}/>
                            <Route path={routes.SUBJECTPAGE} element={<SubjectPage/>}/>
                            <Route path={routes.PROFESSORPAGE} element={<ProfessorPage/>}/>
                            <Route path ={routes.PROFESSORPAGE + '/:professorId'} element={<ProfessorDetailsPage/>}/>
                            <Route path={routes.ADMINSETTINGSPAGE} element={<AdminSettingsPage/>}/>
                            <Route path={routes.USERSETTINGSPAGE}
                            element={<UserSettingsPage/>}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}