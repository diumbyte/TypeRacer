import './GameCountdown.css'

export default function GameCountdown({seconds}) {
    return (
        <div className="game-countdown">
            {seconds}
        </div>
    )
}

