type Routes={
    [key:string]:string
};
export const routes:Routes={
    LOGIN : '',
    REGISTER : '/register',
    NEWSPAGE: '/news',
    MATERIALSPAGE: '/material',
    SUBJECTPAGE: '/subject',
    PROFESSORPAGE: '/professor',
    ADMINSETTINGSPAGE: '/admin/settings',
    VERIFYEMAILPAGE: '/verify-email',
    NO_PAGE_FOUND: '*'
}