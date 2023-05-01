import socketio from 'socket.io-client';

import React from 'react';
import config from '~/config';

const { token } = JSON.parse(localStorage.getItem(config.localStorageKey.auth));

export const socket = socketio.connect(config.socketURL + '/employee_chat', {
    extraHeaders: {
        authenticate_jwt: token,
    },
    autoConnect: false,
    reconnection: false,
});

export const SocketChatContext = React.createContext();
