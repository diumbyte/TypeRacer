import { useEffect, useState } from 'react';
import useEventListener from './useEventListener';

const checkIfValidTextKey = (key) => {
  return (/^[a-z0-9'",.\-\_&\(\);\:\?\\\[\]]$/i.test(key) && key.length === 1)
}

export default function useGuidedTyper(inputRef, quote = "", setInputText, userCompletedTyping, updateCurrentIndex) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [currentWordStartIdx, setCurrentWordStartIdx] = useState(0);
  const [currentWordEndIdx, setCurrentWordEndIdx] = useState(-1);

  const [incorrectMoves, setIncorrectMoves] = useState(0);
  const [allInputSelected, setAllInputSelected] = useState(false);

  const onKeyDown = (e) => {
    const {key, ctrlKey} = e;
    
    if((key === "a" && ctrlKey)) {
      return setAllInputSelected(true);
    }

    if(key === "Backspace") {
      if(allInputSelected) {
        setIncorrectMoves(0);
        setAllInputSelected(false);
        return setCurrentIndex(currentWordStartIdx);
      } else {
        if(incorrectMoves > 0) {
          return setIncorrectMoves(incorrectMoves - 1);
        } else {
          return setCurrentIndex(Math.max(currentWordStartIdx, currentIndex - 1))
        }
      }
    }

    
    if(allInputSelected && key === quote[currentWordStartIdx]) {
      setIncorrectMoves(0);
      setAllInputSelected(false);
      return setCurrentIndex(currentWordStartIdx + 1);
    }
    
    if(incorrectMoves > 0) {
      if(!checkIfValidTextKey(key)) {
        return;
      }

      return setIncorrectMoves(incorrectMoves + 1);
    }

    if(allInputSelected && key !== quote[currentWordStartIdx]) {
      // Set incorrect moves accordingly
      setIncorrectMoves(1);
      setAllInputSelected(false);
      return setCurrentIndex(currentWordStartIdx);
    }

    if(!allInputSelected && key === quote[currentIndex]) {
      if(currentIndex === quote.length - 1) {
        userCompletedTyping();
        setCurrentIndex(0);
        setCurrentWordStartIdx(0);
        setCurrentWordEndIdx(quote.indexOf(" ", 0));
        setIncorrectMoves(0);
        return setInputText("");
      }
      if(key === " ") {
        e.preventDefault();
        setInputText(""); 
        setCurrentWordStartIdx(currentIndex + 1);
    
        const endOfCurrentWord = quote.indexOf(" ", currentIndex + 1);
    
        // Assuming that this means we're at the last word
        if(endOfCurrentWord === -1) {
          setCurrentWordEndIdx(quote.length);
        } else {
          setCurrentWordEndIdx(endOfCurrentWord);
        }
      }

      setCurrentIndex(currentIndex + 1);
    } else {
      // if( key === "Shift" || key === "CapsLock" || key === "Backspace" || ctrlKey) {
      //   return;
      // }
      if(!checkIfValidTextKey(key)) {
        return;
      }
      return setIncorrectMoves(incorrectMoves + 1);
    }
  }

  useEventListener(inputRef, "keydown", onKeyDown);
  

  useEffect(() => {
    updateCurrentIndex(currentIndex);
  }, [currentIndex, updateCurrentIndex]);
  
  useEffect(() => {
    setCurrentWordEndIdx(quote.indexOf(" ", currentWordStartIdx))
  }, [quote])

  return {
      currentIndex,
      currentWordStartIdx,
      currentWordEndIdx,
      incorrectMoves
  }
}