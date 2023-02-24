import { HeaderOnlyLayout } from '~/components/Layout';
import Following from '~/pages/Following';
import Home from '~/pages/Home';
import Upload from '~/pages/Upload';
//Layout

// Route không cần đăng nhập
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/following', component: Following, layout: null },
    { path: '/upload', component: Upload, layout: HeaderOnlyLayout },
];

// Route cần đăng nhập
const privateRoutes = [];

export { publicRoutes, privateRoutes };
