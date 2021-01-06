import MatchStatus from './MatchStatus';
type MatchInfo = {
  countdown: number;
  matchStatus: MatchStatus;
  randomWords: string[];
  currentWordIndex: number;
  wordDuration: number;
};

export default MatchInfo;
