import { useEffect, useState } from 'react';
import classname from 'classnames';
import { Num } from './number';
import { Blue } from './blue';
import sound from './sound.mp3';
import refereeSound from './refereeSound.mp3';

const ws = new WebSocket('ws://192.168.10.100:4000');

export function LCD() {
  const [total, setTotal] = useState({
    totalA: 0,
    totalB: 0,
  });
  const [load, setLoad] = useState(false);
  const [refereeCoinActive, setRefereeCoinActive] = useState(false);
  function downloadCoin() {
    setRefereeCoinActive(false);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', sound, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      if (this.status === 200) {
        const blob = new Blob([this.response], {
          type: 'audio/wav',
        });
        const reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          const coinB64 = reader.result;
          if (coinB64 && typeof coinB64 === 'string')
            localStorage.setItem('coin_base64', coinB64);
        };
      }
    };
    xhr.send();
  }
  function downloadRefereeCoin() {
    setRefereeCoinActive(true);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', refereeSound, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      if (this.status === 200) {
        const blob = new Blob([this.response], {
          type: 'audio/wav',
        });
        const reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          const coinB64 = reader.result;
          if (coinB64 && typeof coinB64 === 'string')
            localStorage.setItem('coin_base64', coinB64);
        };
      }
    };
    xhr.send();
  }
  function playCoinDropJS() {
    const coinB64 = localStorage.getItem('coin_base64');
    if (coinB64 && typeof coinB64 === 'string') {
      const snd = new Audio(coinB64);
      snd.muted = false;
      snd.play();
    }
  }
  useEffect(() => {
    if (!load) {
      setLoad(true);
      downloadCoin();
    }
  }, [load]);
  ws.onopen = (event) => {
    console.log('open socket', event);
    ws.send("'type':'registerOperator'");
  };
  ws.onmessage = (message) => {
    const msg = JSON.parse(message.data);
    console.log('operator panel ===>', message);

    if (msg.type === 'syncTotal') {
      if (msg.totalA > total.totalA || msg.totalB > total.totalB) {
        playCoinDropJS();
      }

      setTotal({
        totalA: Number(msg.totalA),
        totalB: Number(msg.totalB),
      });
    }
  };
  return (
    <>
      <div className={classname('flex h-screen w-screen')}>
        <div className="w-1/2 text-[40vw] text-center bg-blue-500 text-[#fff] relative">
          <Num seconds={total.totalA} />
        </div>
        <div className="w-1/2 text-[40vw] text-center bg-red-500 text-[#fff] relative">
          <Blue seconds={total.totalB} />
        </div>
      </div>
      <div className="fixed bottom-0 right-0 flex">
        <button
          className={`${refereeCoinActive ? 'bg-green-700' : ''} py-2 px-5`}
          onClick={downloadRefereeCoin}
        >
          صدای آرای داوران
        </button>
        <button
          className={`${refereeCoinActive ? '' : 'bg-green-700'} py-2 px-5`}
          onClick={downloadCoin}
        >
          صدای آرای تماشاچیان
        </button>
      </div>
    </>
  );
}

export default LCD;
