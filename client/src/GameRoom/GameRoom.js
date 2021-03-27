import { useState, useRef, useEffect, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import GameCountdown from '../GameCountdown/GameCountdown';
import GuidedTyper from '../GuidedTyper/GuidedTyper';
import ProgressBarList from '../ProgressBarList/ProgressBarList';
import useGameRoom from './useGameRoom';
import { UserContext } from '../UserContext/UserContext';
import './GameRoom.css';

export default function GameRoom() {
    const [inputValue, setInputValue] = useState('');
    const textInputRef = useRef(null);
    const match = useRouteMatch();
    const roomId = match.params.roomId;
    const { user } = useContext(UserContext);

    const { 
        users, 
        randomQuote,
        gameInProgress,
        userCompletedText,
        timeLeft,
        restartPending,
        userCompletedTyping,
        updateCurrentIndex,
        startGame,
        startCountdown,
    } = useGameRoom(roomId, user);

    // Can't do focus() in onGameStarted since we need to wait for the code to rerender the text component as not disabled first.
    useEffect(() => {
        textInputRef.current.focus();
    }, [gameInProgress]);
    
    return (
        <div className="container">
            {
                (startCountdown)
                ?   <GameCountdown seconds={timeLeft}/>
                : <></>
            }
            <ProgressBarList
                users={users}
                quoteLength={randomQuote.length}
                userCompletedText={userCompletedText}
                gameInProgress={gameInProgress}
            />
            <GuidedTyper
                        inputRef={textInputRef}
                        userCompletedTyping={userCompletedTyping}
                        setInputValue={setInputValue}
                        updateCurrentIndex={updateCurrentIndex}
                        textToType={randomQuote}
            />
            <input 
                type="text"
                name="text-input" 
                className="text-input"
                disabled={ !gameInProgress || userCompletedText }
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                ref={textInputRef}
            />

            <button
                className="btn"
                disabled={gameInProgress && !restartPending}
                onClick={startGame}
            >
                Start
            </button>
        </div>
    );
}