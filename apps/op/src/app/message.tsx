import React, { FormEvent, useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import playIc from '../assets/play.svg';
import stopIc from '../assets/stop.svg';
import TimerApp from './timer';
import { ClientList } from './clientList';
function OperatorApp() {
  const ws = new WebSocket('ws://192.168.10.100:4040');
  const [clientDetail, setClientDetail] = useState({
    remainingTime: '0',
    clientId: '',
  });
  const [clientList, setClientList] = useState<[{ id: string; name: string }]>([
    { name: '', id: '' },
  ]);

  useEffect(() => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'registerOperator' }));
    };
    ws.onmessage = (event) => {
      console.log(event.data);
      const parsed = JSON.parse(event.data);
      if (parsed.type === 'clientList') {
        const clients = parsed.list;
        console.log(clients);
        setClientList(clients);
      }
      if (parsed.type === 'countdown') {
        setClientDetail({
          clientId: parsed.clientId,
          remainingTime: formatTime(Number(parsed.remainingTime)),
        });
      }
    };
    () => {
      ws.close();
    };
  });
  const sendMessage = (e: FormEvent<EventTarget>) => {
    e.preventDefault();
    const { textBox, user } = e.currentTarget as HTMLFormElement;
    const messageObj = {
      type: 'operatorMessage',
      message: textBox.value,
      user: user.value,
    };
    ws.send(JSON.stringify(messageObj));
    textBox.value = '';
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };
  const pauseCountdown = (id: string) => {
    const countdownObj = {
      type: 'pauseTimer',
      user: id,
    };
    ws.send(JSON.stringify(countdownObj));
  };
  const startCountdown = (id: string) => {
    const countdownObj = {
      type: 'startTimer',
      user: id,
    };
    ws.send(JSON.stringify(countdownObj));
  };

  const stopCountdown = (id: string) => {
    const countdownObj = {
      type: 'stopTimer',
      user: id,
    };
    console.log('stop count down from operator', countdownObj);
    ws.send(JSON.stringify(countdownObj));
  };
  console.log('clients ===> ', clientDetail);
  return (
    <div className="text-right flex">
      <div className="w-1/4 bg-[#017338] h-screen flex flex-col justify-center">
        <div className="text-center">
          <button
            className="bg-[#fff] py-4 px-8 rounded-lg"
            onClick={() => {
              ws.send(JSON.stringify({ type: 'clientList' }));
            }}
          >
            نمایش لیست داوران
          </button>
        </div>
        {clientList.map((item, index) => {
          return (
            <ClientList
              key={'client_list' + index}
              data={item}
              stopCountdown={stopCountdown}
              pauseCountdown={pauseCountdown}
              startCountdown={startCountdown}
            />
          );
        })}
      </div>

      <div className="w-3/4">
        <div className="flex justify-center items-center h-screen">
          <form className="max-w-3xl w-full" onSubmit={sendMessage}>
            <img src={logo} className="w-60 mx-auto" />
            <div className="pb-10">
              <label className="w-full">
                کاربر مورد نظر خود را انتخاب کنید
              </label>
              <select
                className="w-full text-right border border-[#017338] py-3 px-8 rounded-lg"
                name="user"
              >
                {clientList.map((item, index) => {
                  return (
                    <option
                      key={'message_client_list_' + index}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <textarea
              className="w-full border border-[#017338] rounded-md py-3 px-5 my-2"
              name="textBox"
              rows={5}
            />
            <button
              className="rounded-md bg-[#017338] text-emerald-50 py-3 px-6"
              type="submit"
            >
              ارسال
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OperatorApp;
