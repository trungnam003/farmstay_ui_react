import classNames from 'classnames/bind';

import { Col, Row } from 'react-bootstrap';

import styles from './FarmstayDashboard.module.scss';
import { useEffect, useState } from 'react';
import AreaVisualization from '../../components/AreaVisualization/AreaVisualization';
import { SocketFarmstayContext, socket } from '~/context/socketFarmstayContext';
import { useSelector } from 'react-redux';
import { userApi } from '~/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import config from '~/config';

const cx = classNames.bind(styles);

// function convertTimestampToDate(timeStamp) {
//     const dateFormat = new Date(timeStamp);
//     return (
//         dateFormat.getDate() +
//         '/' +
//         (dateFormat.getMonth() + 1) +
//         '/' +
//         dateFormat.getFullYear() +
//         ' ' +
//         dateFormat.getHours() +
//         ':' +
//         dateFormat.getMinutes() +
//         ':' +
//         dateFormat.getSeconds()
//     );
// }

function FarmstayDashboard() {
    const [areas, setAreas] = useState({});
    const auth = useSelector((state) => state.auth);
    const { token } = auth;
    // useEffect(() => {
    //     socket.on('connect_error', (err) => {
    //         console.log(`connect_error due to ${err.message}`);
    //     });
    // }, []);

    useEffect(() => {
        if (token) {
            userApi.getFieldEquipments({ token }).then((res) => {
                const {
                    data: { equipments, farmstay_id },
                } = res;
                const areas = {};
                equipments.forEach((equipment) => {
                    const { area, equipment_fields } = equipment;
                    const fields = Array.from(equipment_fields).map((field) => {
                        return Object.assign(field, { farmstay_id });
                    });
                    if (areas.hasOwnProperty(area)) {
                        areas[area].push(...fields);
                    } else {
                        areas[area] = [...fields];
                    }
                });
                socket.open();
                setAreas(areas);
            });
        }
    }, [token]);

    return (
        <SocketFarmstayContext.Provider value={socket}>
            <ToastContainer />
            <div className={cx('wrapper')}>
                <h2 className={cx('dashboard-title')}>Dashboard Farmstay</h2>
                <div className={cx('container')}>
                    <Row>
                        <Col xl={12}>
                            {Object.keys(areas).map((area) => {
                                return <AreaVisualization key={area} name={area} fields={areas[area]} />;
                            })}
                        </Col>
                    </Row>
                </div>
            </div>
        </SocketFarmstayContext.Provider>
    );
}

export default FarmstayDashboard;
