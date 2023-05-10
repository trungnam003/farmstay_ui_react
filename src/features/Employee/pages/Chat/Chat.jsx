import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import Conversation from '../../components/Conversation';
import Message from '../../components/Message';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { employeeApi } from '~/api';
import FormSendMessage from '../../components/FormSendMessage';
import { socket as chatSocket } from '~/context/socketChatContext';
import HeaderCurrentConversation from '../../components/HeaderCurrentConversation/HeaderCurrentConversation';
import { useNavigate } from 'react-router-dom';
import EmployeeItem from '../../components/EmployeeItem/EmployeeItem';

const cx = classNames.bind(styles);

function Chat() {
    const auth = useSelector((state) => state.auth);
    const user = useSelector((state) => state.user);

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [employees, setEmployees] = useState([]);

    const navigate = useNavigate();

    const scrollRef = useRef();
    const { token } = auth;

    useEffect(() => {
        const { user_type } = user;
        // console.log(user);
        if (user_type !== 'employee' && user_type !== null) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (token && user.user_type === 'employee') {
            employeeApi
                .getConversations({ token })
                .then((res) => {
                    setConversations(() => {
                        if (Array.isArray(res.data) && res.data.length > 0) {
                            setCurrentConversation(res.data[0]);
                            return res.data;
                        }
                        return [];
                    });
                })
                .catch((err) => {
                    const {
                        response: {
                            data: { code },
                        },
                    } = err;
                    if (code === 403) {
                        navigate('/');
                    } else if (code === 401) {
                        navigate('/auth/login');
                    }
                });
            chatSocket.open();

            employeeApi
                .getAllEmployeesNoConversation({ token })
                .then((res) => {
                    setEmployees(() => {
                        if (Array.isArray(res.data)) {
                            return res.data;
                        }
                        return [];
                    });
                })
                .catch((err) => {
                    const {
                        response: {
                            data: { code },
                        },
                    } = err;
                    if (code === 403) {
                        navigate('/');
                    } else if (code === 401) {
                        navigate('/auth/login');
                    }
                });
        }
    }, [token, navigate, user]);

    useEffect(() => {
        if (token && user && currentConversation) {
            const func = (res) => {
                const {
                    employee: { id },
                } = user;
                if (res.conversation_id === currentConversation._id && id !== res.sender_id) {
                    setMessages((prev) => {
                        return [...prev, res];
                    });
                }
                setConversations((prev) => {
                    const data = res;
                    const index = prev.findIndex((conversation) => {
                        const { _id } = conversation;
                        const { conversation_id } = data;
                        return _id === conversation_id;
                    });

                    if (index > -1) {
                        prev[index]['latest_message'] = data;
                    }
                    return [...prev];
                });
            };
            chatSocket.on('new_message', func);

            return () => {
                chatSocket.removeListener('new_message', func);
            };
        }
    }, [token, user, currentConversation]);

    useEffect(() => {
        const funcNewConversation = (res) => {
            chatSocket.emit('join_conversation', { conversation_id: res._id });
            setConversations((prev) => {
                return [res, ...prev];
            });
            if (currentConversation === null) {
                setCurrentConversation(res);
            }
            console.log(res);
        };
        chatSocket.on('new_conversation', funcNewConversation);

        return () => {
            chatSocket.removeListener('new_conversation', funcNewConversation);
        };
    }, [currentConversation]);

    useEffect(() => {
        if (token && currentConversation) {
            if (currentConversation.is_new_conversation === true) {
                setMessages([]);
            } else {
                employeeApi
                    .getMessagesOfConversation({ token, conversationId: currentConversation._id })
                    .then((res) => {
                        setMessages(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }, [currentConversation, token]);

    useEffect(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSubmitSendMessage = (values, { resetForm }) => {
        const { message } = values;
        if (token && currentConversation && message !== '') {
            if (currentConversation.is_new_conversation === true) {
                const { members } = currentConversation;
                const { employee } = user;
                const index = members.findIndex((member) => {
                    return member.id !== employee.id;
                });
                if (index > -1) {
                    const { id: receiverId } = members[index];
                    employeeApi
                        .createConversation({ token, receiverId })
                        .then((res) => {
                            const { data } = res;
                            chatSocket.emit('join_conversation', { conversation_id: data._id });
                            setCurrentConversation(data);
                            setEmployees((prev) => {
                                const employeeRemove = prev.findIndex((item) => {
                                    return item.id === receiverId;
                                });
                                if (employeeRemove > -1) {
                                    prev.splice(employeeRemove, 1);
                                }
                                return prev;
                            });
                            const { _id } = data;
                            // send message
                            employeeApi
                                .sendMessage({ token, conversationId: _id, text: message })
                                .then((res) => {
                                    setMessages((prev) => {
                                        return [...prev, res.data];
                                    });
                                    setConversations((prev) => {
                                        data['latest_message'] = res.data;
                                        return [data, ...prev];
                                    });
                                    resetForm();
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            } else {
                const { _id } = currentConversation;
                employeeApi
                    .sendMessage({ token, conversationId: _id, text: message })
                    .then((res) => {
                        setMessages((prev) => {
                            return [...prev, res.data];
                        });
                        setConversations((prev) => {
                            const { data } = res;
                            const index = prev.findIndex((conversation) => {
                                const { _id } = conversation;
                                const { conversation_id } = data;
                                return _id === conversation_id;
                            });
                            if (index > -1) {
                                prev[index]['latest_message'] = data;
                            }
                            return [...prev];
                        });
                        resetForm();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    };
    return (
        <Container fluid className={cx('wrapper')}>
            <Row>
                <Col xs={3} className={cx('member')}>
                    <div className={cx('member-header')}>
                        <h3 className="fw-bold">Chat Nội Bộ</h3>
                    </div>
                    <div className={cx('member-body')}>
                        <Stack>
                            {conversations.map((conversation) => {
                                return (
                                    <Conversation
                                        key={conversation._id}
                                        onClick={() => {
                                            if (currentConversation._id !== conversation._id) {
                                                setCurrentConversation(conversation);
                                            }
                                        }}
                                        active={currentConversation && currentConversation._id === conversation._id}
                                        conversation={conversation}
                                    />
                                );
                            })}
                        </Stack>
                    </div>
                </Col>
                <Col xs={7} className="g-0">
                    <div className={cx('messages-wrapper')}>
                        <div className={cx('messages-header')}>
                            <HeaderCurrentConversation conversation={currentConversation} />
                        </div>
                        <div ref={scrollRef} className={cx('messages-body')}>
                            {messages.length > 0 ? (
                                messages.map((message) => {
                                    const { employee } = user;
                                    return (
                                        <Message
                                            message={message}
                                            key={message._id}
                                            own={employee.id === message.sender_id}
                                        >
                                            {message.content}
                                        </Message>
                                    );
                                })
                            ) : (
                                <div className="mt-4">
                                    <p className="text-center fs-5">Gửi tin nhắn để bắt đầu cuộc trò chuyện</p>
                                </div>
                            )}
                        </div>
                        <div className={cx('messages-footer')}>
                            <FormSendMessage
                                token={token}
                                currentConversation={currentConversation}
                                onSubmit={handleSubmitSendMessage}
                            />
                        </div>
                    </div>
                </Col>
                <Col xs={2} className={cx('member')}>
                    <div className={cx('member-header')}>
                        <h3 className="fw-bold">Nhân viên</h3>
                    </div>
                    <div className={cx('member-body')}>
                        <Stack>
                            {employees.map((employee) => {
                                return (
                                    <div
                                        key={employee.id}
                                        onClick={() => {
                                            const memberSend = {
                                                id: user.employee.id,
                                                fullname: user.employee.fullname,
                                            };
                                            const memberReceive = { id: employee.id, fullname: employee.fullname };

                                            const newConversation = { is_new_conversation: true };
                                            newConversation['name'] = employee.fullname;
                                            newConversation['members'] = [memberSend, memberReceive];
                                            // console.log(newConversation);
                                            // console.log(currentConversation);

                                            setCurrentConversation(newConversation);
                                        }}
                                    >
                                        <EmployeeItem employee={employee} />
                                    </div>
                                );
                            })}
                        </Stack>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;
