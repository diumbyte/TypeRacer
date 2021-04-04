import { useState } from 'react';

export default function useElapsedTime() {
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    
    const stopTimer = () => {
        if (!startTime) return;
    
        const currentTime = new Date() * 1;
        setElapsedTime(currentTime - startTime);
        setStartTime(null);
    }

    const startTimer = () => {
        setStartTime((new Date()) * 1);
        setElapsedTime(0);
    }

    return {
        elapsedTime,
        startTimer,
        stopTimer
    };
}