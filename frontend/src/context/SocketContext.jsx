// frontend/src/context/SocketContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5014', {
            transports: ['websocket', 'polling']
        });
        
        newSocket.on('connect', () => {
            console.log('Connected to Socket.IO server.');
        });
        newSocket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};