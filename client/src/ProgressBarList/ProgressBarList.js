import ProgressBar from '../ProgressBar/ProgressBar';
import CheckmarkIcon from '../assets/check.svg'
import './ProgressBarList.css';

// users = [{id: String, name: String, currentIndex: Number}]
export default function ProgressBarList({users, quoteLength = 1, gameInProgress}) {
    const showTextCompletedIndicator = (user) => user.typingComplete && gameInProgress;
    
    const percentage = (currentIndex) => {
        if(!currentIndex) {
            return 0;
        } else {
            return Math.round((currentIndex / quoteLength) * 100);
        }
    }

    const fillerColor = (userIsSelf) => userIsSelf ? 'rgba(42, 127, 98, 100)': 'rgba(42, 127, 98, 0.3)';
    
    return (
        <ul className="progress-list">
            {
                users.map(user => (
                    <li key={`${user.id}_progress`}>
                        <div className="progress-info">
                            {
                                showTextCompletedIndicator(user)
                                ?   <img className="svg-icon checkmark" src={CheckmarkIcon} alt="Checkmark icon"/>
                                : <></>
                            }
                            <span className="progress-username">{user.name}</span> 
                        </div>
                        <ProgressBar
                            percentage={percentage(user.currentIndex)}
                            fillerColor={fillerColor(user.isSelf)}
                        />
                    </li>
                ))
            }
        </ul>
    )
}