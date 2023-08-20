import { useState } from 'react';
import classname from 'classnames';
import { Num } from './number';
import { Blue } from './blue';

const ws = new WebSocket('ws://localhost:4000');

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
    </>
  );
}

export default LCD;
