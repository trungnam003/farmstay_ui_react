import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import config from '~/config';
import { DefaultLayout, DefaultLayoutFull } from '~/layouts';
import Chat from './pages/Chat';
import Menu from './pages/Menu';

function Employee() {
    return (
        <>
            <Routes>
                <Route
                    path={''}
                    element={
                        <DefaultLayout>
                            <Menu />
                        </DefaultLayout>
                    }
                />
                <Route
                    path={config.routes.employee.child.chat}
                    element={
                        <DefaultLayoutFull>
                            <Chat />
                        </DefaultLayoutFull>
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

export default Employee;
