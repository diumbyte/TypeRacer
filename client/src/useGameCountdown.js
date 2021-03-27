import { useState, useEffect } from 'react';

export default function GameCountdown(seconds, onCompleteCallback) {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [startCountdown, setStartCountdown] = useState(false);

    useEffect(() => {
        let intervalId;

        if (timeLeft === null || !startCountdown) {
            return;
        }
        
        if (timeLeft > 0) {
            // Save intervalId to clear the interval when component rerenders
            intervalId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        }

        // Exit at 0
        if (timeLeft === 0 && startCountdown) {
            onCompleteCallback();
            setStartCountdown(false);
            setTimeLeft(seconds);
            return;
        }


        // Clear the interval on rerender
        return () => {
            clearInterval(intervalId);
        }
        // timeLeft as dependency will force effect to rerun when we update it
    }, [timeLeft, startCountdown, seconds, onCompleteCallback])

    return [
        {
            timeLeft,
            startCountdown
        }, setStartCountdown];
}