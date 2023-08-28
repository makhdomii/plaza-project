import { useState } from 'react';
import classname from 'classnames';
import { Num } from './number';
import { Blue } from './blue';
// import sound from './sound.mp3';

const ws = new WebSocket('ws://192.168.10.100:4000');

export function LCD() {
  const [total, setTotal] = useState({
    totalA: 0,
    totalB: 0,
  });

  ws.onopen = (event) => {
    console.log('open socket', event);
    ws.send("'type':'registerOperator'");
  };
  ws.onmessage = (message) => {
    const msg = JSON.parse(message.data);
    console.log('operator panel ===>', message);

    if (msg.type === 'syncTotal') {
      // if (msg.totalB > total.totalB) {
      //   for (let i = total.totalB; total.totalB <= msg.totalB; i++) {
      //     const audio = new Audio(sound);
      //     audio.play();
      //   }
      // }
      // if (msg.totalA > total.totalA) {
      //   for (let i = total.totalA; total.totalA <= msg.totalA; i++) {
      //     const audio = new Audio(sound);
      //     audio.play();
      //   }
      // }
      setTotal({
        totalA: Number(msg.totalA),
        totalB: Number(msg.totalB),
      });
    }
  };
  return (
    <div className={classname('flex h-screen w-screen')}>
      <div className="w-1/2 text-[40vw] text-center bg-blue-500 text-[#fff] relative">
        <Num seconds={total.totalA} />
      </div>
      <div className="w-1/2 text-[40vw] text-center bg-red-500 text-[#fff] relative">
        <Blue seconds={total.totalB} />
      </div>
    </div>
  );
}

export default LCD;
