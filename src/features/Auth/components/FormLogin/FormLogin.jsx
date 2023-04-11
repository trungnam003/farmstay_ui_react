import classNames from 'classnames/bind';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

import styles from './FormLogin.module.scss';
import { Formik, Form as FormFormik, FastField } from 'formik';
import InputField from '~/customs/fields/InputField';
import { authApi, userApi } from '~/api';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '~/redux/auth/authSlice';
import config from '~/config';

const cx = classNames.bind(styles);

// const GENDER = [
//     { value: 'male', label: 'Nam' },
//     { value: 'female', label: 'Nữ' },
//     { value: 'orther', label: 'Khác' },
// ];

function FormLogin() {
    const navigate = useNavigate();
    const [showLoginFailed, setShowLoginFailed] = useState('');
    const dispatch = useDispatch();

    const initialValues = {
        login: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        login: Yup.string().required('Trường này bắt buộc'),
        password: Yup.string().required('Trường này bắt buộc'),
    });

    const handleSubmitLogin = (values) => {
        const { login, password } = values;
        const handleApiLogin = async () => {
            try {
                const res = await authApi.login({ login, password });
                const { authenticate_jwt: token, token_expires_in: exp } = res;
                const action = loginAction({ token, exp });
                localStorage.setItem(config.localStorageKey.auth, JSON.stringify({ token, exp }));
                dispatch(action);
                const user = await userApi.getInfoUser({ token });
                const {
                    data,
                    data: { is_active },
                } = user;
                localStorage.setItem(config.localStorageKey.user, JSON.stringify(data));
                if (is_active) {
                    navigate(config.routes.home.path);
                } else {
                    navigate([config.routes.user.path, config.routes.user.child.active].join('/'));
                }
            } catch (error) {
                const { response } = error;
                // console.log(response.data);
                setShowLoginFailed(response.data.message);
            }
        };
        handleApiLogin();
    };
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmitLogin}>
            {(formikProps) => {
                // Do somthing
                // const { values, errors, touched } = formikProps;
                return (
                    <FormFormik>
                        <FastField
                            name="login"
                            component={InputField}
                            //
                            type="text"
                            label="Email hoặc username"
                            placeholder="name@example.com"
                            description="Nhập email hoặc username đã đăng ký tài khoản Farmstay."
                        ></FastField>
                        <FastField
                            name="password"
                            component={InputField}
                            //
                            type="password"
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu"
                            description="Mật khẩu của bạn phải dài 8-20 ký tự, chỉ chứa các chữ cái và số."
                        ></FastField>

                        <div>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" label="Lưu đăng nhập" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Link
                                        to="/forgot-password"
                                        className={cx('text-primary', 'd-flex', 'justify-content-end')}
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                        {showLoginFailed !== '' && (
                            <Alert variant="danger" className="text-center p-1 fw-bold">
                                {showLoginFailed}
                            </Alert>
                        )}
                        <Button type="submit" className={cx('btn-form')} variant="success">
                            Đăng nhập
                        </Button>
                    </FormFormik>
                );
            }}
        </Formik>
    );
}

export default FormLogin;
