type Routes={
    [key:string]:string
};
export const routes:Routes={
    LOGIN : '/login',
    REGISTER : '/register',
    NEWSPAGE: '/news',
    MATERIALSPAGE: '/material',
    SUBJECTPAGE: '/subject',
    PROFESSORPAGE: '/professor',
    ADMINSETTINGSPAGE: '/admin/settings',
    NO_PAGE_FOUND: '*'
}