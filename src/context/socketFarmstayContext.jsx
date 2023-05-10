import socketio from 'socket.io-client';

import React from 'react';
import config from '~/config';

const auth = JSON.parse(localStorage.getItem(config.localStorageKey.auth));

export const socket = socketio.connect(config.socketURL + '/farmstay', {
    extraHeaders: {
        'authenticate-jwt': auth ? auth.token : '',
    },
    autoConnect: false,
    reconnection: false,
});
export const SocketFarmstayContext = React.createContext();
