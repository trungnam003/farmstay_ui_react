import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import config from '~/config';
import { EmptyLayout, DefaultLayout } from '~/layouts';
import ActiveUser from './pages/ActiveUser';
import FarmstayDashboard from './pages/FarmstayDashboard';
import UserInfo from './pages/UserInfo';

function User() {
    return (
        <>
            <Routes>
                <Route
                    path={''}
                    element={
                        <DefaultLayout>
                            <UserInfo />
                        </DefaultLayout>
                    }
                />
                <Route
                    path={config.routes.user.child.active}
                    element={
                        <EmptyLayout>
                            <ActiveUser />
                        </EmptyLayout>
                    }
                />
                <Route
                    path={config.routes.user.child.dashboard}
                    element={
                        <DefaultLayout>
                            <FarmstayDashboard />
                        </DefaultLayout>
                    }
                />
                <Route
                    path="*"
                    element={
                        <>
                            <div>Page Not Found</div>
                        </>
                    }
                />
            </Routes>
            <Outlet />
        </>
    );
}

export default User;
