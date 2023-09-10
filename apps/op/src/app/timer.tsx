import React, { useState, useEffect } from 'react';

function TimerApp({ letStartTimer = false, pause = false }) {
  const [startTime, setStartTime] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (pause) {
      pauseTimer();
    } else if (letStartTimer) {
      console.log('start timer function called !');
      startTimer();
    } else {
      stopTimer();
    }
    // if (timerRunning && startTime) {
    //   console.log('timer should start !');
    //   const intervalId = setInterval(() => {
    //     const now = Date.now();
    //     const elapsed = Math.floor((now - startTime) / 1000); // Convert to seconds
    //     console.log(now - startTime);
    //     setCurrentTime(elapsed);
    //   }, 1000);

    //   return () => {
    //     clearInterval(intervalId);
    //   };
    // }
    let interval: any;

    if (timerRunning) {
      interval = setInterval(() => {
        setCurrentTime((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerRunning, startTime, letStartTimer]);

  const startTimer = () => {
    // const rst = new Date().getTime();
    // setStartTime(rst);
    setTimerRunning(true);
  };
  const pauseTimer = () => {
    setTimerRunning(false);
    // setCurrentTime(0); // Reset timer to 0 when stopped
  };
  const stopTimer = () => {
    setTimerRunning(false);
    setCurrentTime(0); // Reset timer to 0 when stopped
  };
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
