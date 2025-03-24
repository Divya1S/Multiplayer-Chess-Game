import { useEffect, useState } from 'react';

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        // Fixed typo in WebSocket URL (ws.// to ws://)
        const ws = new WebSocket(WS_URL);

        // Fixed syntax error in arrow function (removed extra -)
        ws.onopen = () => {
            setSocket(ws);
        };

        ws.onclose = () => {
            setSocket(null);
        };

        // Cleanup function
        return () => {
                ws.close();
        };
    }, []); // Empty dependency array is correct here

    return socket;
};

