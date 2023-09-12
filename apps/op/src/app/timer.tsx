import { useState, useEffect } from 'react';

function TimerApp({ letStartTimer = false, pause = false, reset = false }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (reset && !letStartTimer) {
      setTimerRunning(false);
      setCurrentTime(0);
    }
    if (pause) {
      setTimerRunning(false);
    } else if (letStartTimer) {
      console.log('start timer function called !');
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
      setCurrentTime(0);
    }
    let interval: ReturnType<typeof setInterval>;

    if (timerRunning) {
      interval = setInterval(() => {
        setCurrentTime((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerRunning, letStartTimer, pause, reset]);

  const str_pad_left = (
    string: string | number,
    pad: string | undefined,
    length: number
  ) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime - minutes * 60;
  return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}

export default TimerApp;
