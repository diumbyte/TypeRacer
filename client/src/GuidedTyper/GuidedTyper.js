import useGuidedTyper from '../useGuidedTyper';
import './GuidedTyper.css'

export default function GuidedTyper({
    inputRef, 
    textToType = "", 
    setInputValue, 
    userCompletedTyping,
    updateCurrentIndex
    }) 
{    
    const { 
        currentIndex,
        currentWordStartIdx,
        currentWordEndIdx,
        incorrectMoves
    }  = useGuidedTyper(inputRef, textToType, setInputValue, userCompletedTyping, updateCurrentIndex);

    if(currentWordStartIdx <= currentIndex && currentIndex <= currentWordEndIdx) {
        return (
        <div className="guided-typer">
            <span className="text__correct">{textToType.slice(0, currentWordStartIdx)}</span>
            <span className="text__correct text__current">{textToType.slice(currentWordStartIdx, currentIndex)}</span>
            { incorrectMoves > 0 
            ? <>
                <span className="text__incorrect">{textToType.slice(currentIndex, currentIndex + incorrectMoves)}</span>
                <span className="text__remainder">{textToType.slice(currentIndex + incorrectMoves)}</span>
                </>
            : <>
                <span className="text__current">{textToType.slice(currentIndex, currentWordEndIdx)}</span> 
                <span className="text__remainder"> {textToType.slice(currentWordEndIdx + 1)}</span>
                </>
            }
        </div>
        )
        } else {
        return (
            <div className="guided-typer">
                <span className="text__correct">{textToType.slice(0, currentWordStartIdx)}</span>
                <span className="text__current">{textToType.slice(currentWordStartIdx, currentWordEndIdx)}</span>
                <span className="text__remainder"> {textToType.slice(currentWordEndIdx + 1)}</span>
            </div>
        )
    }
}