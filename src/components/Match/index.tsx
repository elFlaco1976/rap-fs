import React, { useState, useEffect } from 'react';
import MatchInfo from '../../types/MatchInfo';
import MatchStatus from '../../types/MatchStatus';
import getWords from '../../utils/words';
import { Button } from 'react-bootstrap';
import './style.scss';

const Match: React.FC = () => {
  const initialMatchInfo: MatchInfo = {
    countdown: 60,
    matchStatus: MatchStatus.notStarted,
    randomWords: [],
    currentWordIndex: 0,
    wordDuration: 5,
  };

  const finalMatchInfo: MatchInfo = {
    countdown: 60,
    matchStatus: MatchStatus.finished,
    randomWords: [],
    currentWordIndex: 0,
    wordDuration: 5,
  };

  const [gameStatus, setGameStatus] = useState<MatchInfo>(initialMatchInfo);

  const onStart = () => {
    if (gameStatus.matchStatus === MatchStatus.notStarted || gameStatus.matchStatus === MatchStatus.pause) {
      setGameStatus({ ...gameStatus, matchStatus: MatchStatus.started });
    }
  };

  const onPause = () => {
    if (gameStatus.matchStatus === MatchStatus.started) {
      setGameStatus({ ...gameStatus, matchStatus: MatchStatus.pause });
    }
  };

  //On component did mount. Update state with random words
  useEffect(() => {
    setGameStatus({ ...gameStatus, randomWords: getWords() });
  }, []);

  const updateCountdown = (interval: NodeJS.Timeout | null) => {
    setGameStatus((prevState) => {
      const newCountDown = prevState.countdown - 1;
      if (newCountDown === 0 && interval) {
        clearInterval(interval);
        return finalMatchInfo;
      } else if (newCountDown % gameStatus.wordDuration === 0) {
        return { ...prevState, countdown: newCountDown, currentWordIndex: prevState.currentWordIndex + 1 };
      } else {
        return { ...prevState, countdown: newCountDown };
      }
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameStatus.matchStatus === MatchStatus.started) {
      interval = setTimeout(() => {
        updateCountdown(interval);
      }, 1000);
    } else if (
      (gameStatus.matchStatus === MatchStatus.finished || gameStatus.matchStatus === MatchStatus.pause) &&
      interval
    ) {
      clearInterval(interval);
    }

    //Clear interval when unmount
    if (interval) {
      return () => clearInterval(interval as NodeJS.Timeout);
    }
  });

  return (
    <>
      {gameStatus.matchStatus === MatchStatus.notStarted && (
        <div>
          Match not started!
          <Button onClick={onStart}>Start</Button>
        </div>
      )}
      {gameStatus.matchStatus === MatchStatus.started && (
        <div>
          Match started!
          <Button onClick={onPause}>Pause</Button>
          <p>{gameStatus.countdown}</p>
          {gameStatus.randomWords.length !== 0 && <p>{gameStatus.randomWords[gameStatus.currentWordIndex]}</p>}
        </div>
      )}
      {gameStatus.matchStatus === MatchStatus.pause && (
        <div>
          Match Paused!
          <Button onClick={onStart}>Re-start</Button>
          <p>{gameStatus.countdown}</p>
        </div>
      )}
      {gameStatus.matchStatus === MatchStatus.finished && (
        <div>
          Match finished!
          <Button onClick={onStart}>Start new match</Button>
        </div>
      )}
    </>
  );
};

export default Match;
