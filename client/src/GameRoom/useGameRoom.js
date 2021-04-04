import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import socketIoClient from 'socket.io-client';
import socketEvents from './socketEvents';
import useGameCountdown from '../useGameCountdown';
import useElapsedTime from '../useElapsedTime';

// const SOCKET_SERVER_URL = "http://localhost:3001";
const SOCKET_SERVER_URL = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

export default function useGameRoom(roomId, name) {
    const [users, setUsers] = useState([]);
    const [randomQuote, setRandomQuote] = useState("");
    const [gameInProgress, setGameInProgress] = useState(false);
    const [restartPending, setRestartPending] = useState(true);
    const [userCompletedText, setUserCompletedText] = useState(true);
    const socketRef = useRef();
    
    const {
        elapsedTime,
        startTimer,
        stopTimer
    } = useElapsedTime();

    const onGameStarted = () => {
        setUserCompletedText(false);
        setGameInProgress(true);
        setRestartPending(false);
    }
    const [{timeLeft, startCountdown}, setStartCountdown] = useGameCountdown(3, onGameStarted);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get(`${SOCKET_SERVER_URL}/api/rooms/${roomId}/users`);
            const result = res.data;
            setUsers(result)
        }

        fetchUsers();
    }, [roomId]);

    useEffect(() => {
        const fetchRoomStatus = async () => {
            const res = await axios.get(`${SOCKET_SERVER_URL}/api/rooms/${roomId}`);
            const { usersFetch, quote, gameInProgress } = res.data;

            setGameInProgress(gameInProgress);
            if (usersFetch !== undefined) {
                setUsers([...usersFetch]);
            }
            
            if(gameInProgress) {
                setRandomQuote(quote);
                setRestartPending(false);
            }
        }

        fetchRoomStatus();
    }, [roomId])

    useEffect(() => {
        socketRef.current = socketIoClient(SOCKET_SERVER_URL, {
            query: {
                roomId,
                name
            }
        })

        socketRef.current.on("connect", () => {
            const self = {
                id: socketRef.current.id,
                isSelf: true,
                name,
                typingComplete: false,
                currentIndex: 0,
                startTime: 0,
                elapsedTime: 0
            }
            setUsers((users) => 
                [
                    ...users, 
                    self
                ]
            );
        })

        socketRef.current.on(socketEvents.USER_JOIN_CHAT, user => {
            if(user.id === socketRef.current.id) return;
            if(user.error) return;

            user.isSelf = false;
            setUsers((users) => [...users, user]);
        })

        socketRef.current.on(socketEvents.USER_UPDATE_CURRENT_INDEX, payload => {
            setUsers(currentUsers => currentUsers.map((u) => 
                u.id === payload.id
                ? { ...u, currentIndex: payload.currentIndex}
                : u
            ));
        })

        socketRef.current.on(socketEvents.GAME_START, (quotePayload) => {
            const currentTime = new Date() * 1;

            setRandomQuote(quotePayload.content);
            setStartCountdown(true);
            setUsers(currentUsers => currentUsers.map((u) => (
                { 
                    ...u, 
                    typingComplete: false, 
                    startTime: currentTime,
                    elapsedTime: 0
                }
                    )
                )
            );
        })

        socketRef.current.on(socketEvents.USER_COMPLETED_TEXT, (userIdThatCompletedText) => {
            const currentTime = new Date() * 1;
            setUsers(currentUsers => currentUsers.map(u => 
                u.id === userIdThatCompletedText
                ? { ...u, typingComplete: true, elapsedTime: currentTime - u.startTime}
                : u
            ));
        })

        socketRef.current.on(socketEvents.USER_LEAVE_CHAT, user => {
            if(user.id === socketRef.current.id) return;
            if(user.error) return;
            setUsers((users) => users.filter(u => u.id !== user.id));
        })

        socketRef.current.on(socketEvents.GAME_END, () => {
            setRestartPending(true);
        });

        return () => {
            socketRef.current.disconnect();
        }
    }, [roomId, name, socketRef]);

    const updateCurrentIndex = useCallback((currentIndex) => {
        if (!socketRef.current) return;

        socketRef.current.emit(socketEvents.USER_UPDATE_CURRENT_INDEX, currentIndex);
    }, [])

    const startGame = () => {
        if(!socketRef.current) return;

        socketRef.current.emit(socketEvents.GAME_START);
    }

    const userCompletedTyping = () => {
        if(!socketRef.current) return;

        setUserCompletedText(true);
        socketRef.current.emit(socketEvents.USER_COMPLETED_TEXT);
    }
    
    return {
        users,
        randomQuote,
        gameInProgress,
        userCompletedText,
        timeLeft,
        startCountdown,
        setStartCountdown,
        restartPending,
        userCompletedTyping,
        updateCurrentIndex,
        setGameInProgress,
        startGame
    }
}