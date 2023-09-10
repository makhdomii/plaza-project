import TimerApp from './timer';
import playIc from '../assets/play.svg';
import stopIc from '../assets/stop.svg';
import { useState } from 'react';

type ClientListType = {
  data: { id: string; name: string };
  pauseCountdown: (id: string) => void;
  startCountdown: (id: string) => void;
  stopCountdown: (id: string) => void;
};
export const ClientList = ({
  data,
  startCountdown,
  pauseCountdown,
  stopCountdown,
}: ClientListType) => {
  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  return (
    <div className="py-5 px-8 border-b">
      <div className="flex justify-between items-center text-[#fff]">
        <p className="font-bold text-lg">دستگاه {data.name}</p>
        {/* {clientDetail.clientId === data.id && ( */}
        <span>
          <TimerApp letStartTimer={start} pause={pause} />
        </span>
        {/* )} */}
        <div className="w-1/3">
          {/* <button
            className=" rounded-3xl bg-[#fbb017] text-emerald-50 p-2 mx-4"
            type="submit"
            onClick={() => {
              setPause(true);
              setStart(false);
              pauseCountdown(data.id);
            }}
          >
            Pause
          </button> */}
          <button
            className=" rounded-3xl bg-[#fbb017] text-emerald-50 p-2 mx-4"
            type="submit"
            onClick={() => {
              setStart(true);
              startCountdown(data.id);
            }}
          >
            <img src={playIc} className="w-5" />
          </button>
          <button
            className=" rounded-3xl bg-[#fbb017] text-emerald-50 p-2"
            type="button"
            onClick={() => {
              setStart(false);
              stopCountdown(data.id);
            }}
          >
            <img src={stopIc} className="w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
