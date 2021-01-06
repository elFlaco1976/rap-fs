import React, { useState, useEffect } from 'react';
import MatchInfo from '../../types/MatchInfo';
import MatchStatus from '../../types/MatchStatus';
import getWords from '../../utils/words';
import { Button, ButtonGroup } from 'react-bootstrap';
import './style.scss';

const Match: React.FC = () => {
  const initialMatchInfo: MatchInfo = {
    countdown: 60,
    matchStatus: MatchStatus.notStarted,
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

  useEffect(() => {
    setGameStatus({ ...gameStatus, randomWords: getWords() });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    console.log('useEffect!!!');
    if (gameStatus.matchStatus === MatchStatus.started) {
      interval = setTimeout(() => {
        setGameStatus((prevState) => {
          const newCountDown = prevState.countdown - 1;
          if (newCountDown % gameStatus.wordDuration === 0) {
            return { ...prevState, countdown: newCountDown, currentWordIndex: prevState.currentWordIndex + 1 };
          } else {
            return { ...prevState, countdown: newCountDown };
          }
        });
      }, 1000);
    } else if (
      (gameStatus.matchStatus === MatchStatus.finished || gameStatus.matchStatus === MatchStatus.pause) &&
      interval
    ) {
      clearInterval(interval);
    }
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
    </>
  );
};

export default Match;
