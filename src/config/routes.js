// const routes = {
//     home: '/',
//     farmstay: '/farmstays',
//     login: '/login',
// };

const routes = {
    auth: {
        path: '/auth',
        child: {
            login: 'login',
            register: 'register',
        },
    },
    home: {
        path: '/',
    },
    user: {
        path: '/user',
        child: {
            active: 'active',
            dashboard: 'farmstay/dashboard',
        },
    },
};
export default routes;
