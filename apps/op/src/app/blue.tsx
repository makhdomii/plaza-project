import React, { useEffect, useState } from 'react';
import './num.css';
type CountDownType = {
  seconds: number;
};
export const Blue = ({ seconds }: CountDownType) => {
  console.log(seconds);
  function changeTime() {
    const sec = Number(seconds);
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec;

    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    document
      .getElementById('blue-1')
      ?.setAttribute('class', 'blue-' + formattedSeconds.substr(0, 1));
    document
      .getElementById('blue-2')
      ?.setAttribute('class', 'blue-' + formattedSeconds.substr(1, 1));
    console.log(document.getElementById('blue-2')?.getAttribute('class'));
  }
  useEffect(() => {
    changeTime();
  });
  return (
    <div className="digital-watch">
      <svg width="0" height="0" viewBox="0 0 0 0">
        <defs>
          <g id="unit-h">
            <path d="M0 20 L20 40 L180 40 L200 20 L180 0 L20 0 Z"></path>
          </g>
          <g id="unit-v">
            <path d="M20 0 L0 20 L0 180 L20 200 L40 180 L40 20 Z"></path>
          </g>
        </defs>
      </svg>
      <div className="second">
        <svg
          id={'blue-2'}
          className={`blue-0`}
          width="300"
          height="340"
          viewBox="0 0 260 480"
        >
          <use xlinkHref="#unit-h" className="segment a" x="30" y="0"></use>
          <use xlinkHref="#unit-v" className="segment b" x="220" y="30"></use>
          <use xlinkHref="#unit-v" className="segment c" x="220" y="250"></use>
          <use xlinkHref="#unit-h" className="segment d" x="30" y="440"></use>
          <use xlinkHref="#unit-v" className="segment e" x="0" y="250"></use>
          <use xlinkHref="#unit-v" className="segment f" x="0" y="30"></use>
          <use xlinkHref="#unit-h" className="segment g" x="30" y="220"></use>
        </svg>
        <svg
          id={'blue-1'}
          className={`blue-0`}
          width="300"
          height="340"
          viewBox="0 0 260 480"
        >
          <use xlinkHref="#unit-h" className="segment a" x="30" y="0"></use>
          <use xlinkHref="#unit-v" className="segment b" x="220" y="30"></use>
          <use xlinkHref="#unit-v" className="segment c" x="220" y="250"></use>
          <use xlinkHref="#unit-h" className="segment d" x="30" y="440"></use>
          <use xlinkHref="#unit-v" className="segment e" x="0" y="250"></use>
          <use xlinkHref="#unit-v" className="segment f" x="0" y="30"></use>
          <use xlinkHref="#unit-h" className="segment g" x="30" y="220"></use>
        </svg>
      </div>
    </div>
  );
};
