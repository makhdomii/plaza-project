import { FormEvent, useEffect, useState } from 'react';
import classname from 'classnames';
import Io, { io, Socket } from 'socket.io-client';

import { Container } from '../components';
import logo from '../assets/logo.png';
import styles from './app.module.scss';
import TimerApp from './timer';
import playIc from '../assets/play.svg';
import reset from '../assets/reset.svg';
import pause from '../assets/pause.svg';
import Menu from './menu';
type PlayerType = {
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  id: string;
  name: string;
};
function Player({ startTimer, pauseTimer, stopTimer, id, name }: PlayerType) {
  const [showPause, setShowPause] = useState(true);
  const [start, setStart] = useState(false);
  const [pauseState, setPauseState] = useState(false);
  return (
    <div
      className={classname(
        'w-1/4 px-3 bg-[#fff] bg-opacity-70',
        styles['referee-box']
      )}
    >
      <p className="text-lg pb-3 text-center">{name}</p>
      <div className="flex justify-between">
        <div className="text-3xl">
          <TimerApp letStartTimer={start} pause={pauseState} />
          {/* {timer} */}
        </div>
        {/* <Player
        startTimer={startTimer}
        pauseTimer={pauseTimer}
        stopTimer={stopTimer}
      /> */}

        <div>
          {showPause && (
            <button
              className="bg-sky-700 py-3 px-5 hover:bg-opacity-75 focus:bg-opacity-80 active:shadow-inner"
              onClick={() => {
                console.log('clicked playIc !');
                setShowPause(false);
                startTimer();
                setPauseState(false);
                setStart(true);
              }}
            >
              <img className="w-4" src={playIc} alt="" />
            </button>
          )}
          {!showPause && (
            <button
              className="bg-sky-700 py-3 px-5 hover:bg-opacity-75 focus:bg-opacity-80 active:shadow-inner"
              onClick={() => {
                console.log('clicked pause!');
                setShowPause(true);
                pauseTimer();
                setPauseState(true);
              }}
            >
              <img className="w-4" src={pause} alt="" />
            </button>
          )}
          <button
            className="bg-rose-800 bg-opacity-75 py-3 px-5 hover:bg-opacity-50 active:bg-opacity-80"
            onClick={() => {
              console.log('clicked pause!');
              setShowPause(true);
              stopTimer();
              setStart(false);
              setPauseState(false);
            }}
          >
            <img className="w-4" src={reset} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
type UserDetail = Array<string>;
export default function Chat() {
  const [refereeList, setRefereeList] = useState<UserDetail>([]);
  const socket: Socket = io('http://192.168.10.100:4040');

  useEffect(() => {
    socket.emit('operatorJoin');
  }, [socket]);
  socket.on('connection', () => {
    console.log('Socket.io connected');
  });
  socket.on('updateUsers', (e) => {
    if (e.length !== refereeList.length) setRefereeList(e);
  });

  socket.on('error', (error) => {
    console.error('Socket.io error', error);
  });

  socket.on('disconnect', () => {
    console.log('Socket.io disconnected');
  });
  const sendMessage = (e: FormEvent<EventTarget>) => {
    e.preventDefault();
    const { textBox, user } = e.currentTarget as HTMLFormElement;
    const messageObj = {
      message: textBox.value,
      id: user.value,
    };
    socket.emit('sendMessage', messageObj);
    textBox.value = '';
  };
  return (
    <>
      <Menu chat />
      <div className="w-screen h-screen flex justify-center items-center bg-emerald-800 bg-opacity-30">
        <div>
          <Container className="flex justify-between pt-5">
            {refereeList &&
              refereeList?.map((item: string, index: number) => {
                const parsed = JSON.parse(item);
                return (
                  <Player
                    key={index}
                    startTimer={() => {
                      socket.emit('startTimer', parsed.id);
                    }}
                    pauseTimer={() => {
                      socket.emit('pauseTimer', parsed.id);
                    }}
                    stopTimer={() => {
                      socket.emit('stopTimer', parsed.id);
                    }}
                    name={parsed.name}
                    id={parsed.id}
                  />
                );
              })}
          </Container>
          <Container className="flex justify-between items-center pt-5">
            <form className="max-w-3xl w-2/3" onSubmit={sendMessage}>
              <div className="pb-3">
                <label className="w-full">
                  کاربر مورد نظر خود را انتخاب کنید
                </label>
                <select
                  className="w-full text-right border border-[#017338] py-3 px-8 rounded-lg bg-[#fff] bg-opacity-70"
                  name="user"
                >
                  {refereeList.map((item: string, index: number) => {
                    const parsed = JSON.parse(item);
                    return (
                      <option
                        key={'message_client_list_' + index}
                        value={parsed.id}
                      >
                        {parsed.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <textarea
                className="w-full border border-[#017338] rounded-md py-3 px-5 mt-2 bg-[#fff] bg-opacity-70"
                name="textBox"
                rows={7}
              />
              <button
                className="rounded-md bg-[#017338] text-emerald-50 py-3 px-6"
                type="submit"
              >
                ارسال
              </button>
            </form>
            <div className="w-1/3">
              <img className="w-40 mx-auto" src={logo} alt="" />
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}
