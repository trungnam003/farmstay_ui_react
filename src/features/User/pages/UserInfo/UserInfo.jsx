import classNames from 'classnames/bind';
import styles from './UserInfo.module.scss';
import Image from 'react-bootstrap/Image';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function UserInfo() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('header-bg')}></div>
                <div className={cx('header-footer')}></div>
                <Image
                    className={cx('user-avatar')}
                    roundedCircle
                    src="https://gocbeyeu.com/wp-content/uploads/2021/09/tranh-to-mau-songoku-2.webp"
                ></Image>
                <div className={cx('username')}>
                    <p>pytuna</p>
                </div>
            </div>
            <div className={cx('body', 'mt-4')}>
                <Row>
                    <Col xl="3">
                        <ListGroup variant="flush" className="fs-5">
                            <ListGroup.Item className={cx('menu-list', 'w-100')}>
                                <span>Thông tin chung</span>
                            </ListGroup.Item>
                            <ListGroup.Item className={cx('menu-list', 'w-100')}>
                                <span>Farmstay đang thuê</span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col xl="9">
                        <ListGroup variant="flush" className="fs-5">
                            <ListGroup.Item>
                                <span>Trạng thái tài khoản: </span>
                                <span>chưa kích hoạt</span>{' '}
                                <Link to="/user/active" className={cx('text-primary', 'fw-bold')}>
                                    <span>Kích hoạt ngay</span>
                                </Link>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span>Email: </span>
                                <span className="fw-semibold">zztrungnamzz@gmail.com</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span>Số điện thoại: </span>
                                <span className="fw-semibold">0865346424</span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default UserInfo;
