import React, { FormEvent, useEffect, useState } from 'react';
// import './App.css';
// import WebSocket from 'ws';
import logo from '../assets/logo.png';
import playIc from '../assets/play.svg';
import stopIc from '../assets/stop.svg';
function OperatorApp() {
  console.log('render');
  const ws = new WebSocket('ws://192.168.10.100:4040');
  const [clientDetail, setClientDetail] = useState({
    remainingTime: '0',
    clientId: '',
  });
  // const [countdownDuration, setCountdownDuration] = useState(0);
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
    // setMessage('');
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };
  const startCountdown = (id: string) => {
    // e.preventDefault();
    // const { minutes, seconds } = e.currentTarget as HTMLFormElement;
    // console.log('countdown submited !', id);
    const countdownObj = {
      type: 'startCountdown',
      // duration: Number(minutes.value) * 60 + seconds.value,
      user: id,
    };
    ws.send(JSON.stringify(countdownObj));
  };

  const stopCountdown = (id: string) => {
    const countdownObj = {
      type: 'stopCountdown',
      user: id,
    };
    console.log('stop count down from operator', countdownObj);
    ws.send(JSON.stringify(countdownObj));
  };
  console.log('clients ===> ', clientDetail);
  return (
    <div className="text-right flex">
      <div className="w-1/4 bg-[#017338] h-screen flex flex-col justify-center">
        <div className='text-center'>
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
          console.log(item);
          return (
            <div key={'client_list' + index} className="py-5 px-8 border-b">
              <div className="flex justify-between items-center text-[#fff]">
                <p className="font-bold text-lg">دستگاه {item.name}</p>
                {clientDetail.clientId === item.id && (
                  <span>{clientDetail.remainingTime}</span>
                )}
                <div className="w-1/3">
                  <button
                    className=" rounded-3xl bg-[#fbb017] text-emerald-50 p-2 mx-4"
                    type="submit"
                    onClick={() => {
                      startCountdown(item.id);
                    }}
                  >
                    <img src={playIc} className="w-5" />
                  </button>
                  <button
                    className=" rounded-3xl bg-[#fbb017] text-emerald-50 p-2"
                    type="button"
                    onClick={() => {
                      stopCountdown(item.id);
                    }}
                  >
                    <img src={stopIc} className="w-5" />
                  </button>
                </div>
              </div>
              <div className="flex relative items-center">
                {/* <input
                    className="w-1/3 border text-center text-slate-900 shadow-sm focus:shadow-lg rounded-3xl py-3 px-5 my-2 ml-1"
                    name="seconds"
                    type="number"
                    placeholder="ثانیه"
                  />
                  <input
                    className="w-1/3 border text-center text-slate-900 shadow-sm focus:shadow-lg rounded-3xl py-3 px-5 my-2"
                    name="minutes"
                    type="number"
                    placeholder="دقیقه"
                  /> */}
              </div>
            </div>
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
  // return (
  // <div className="App">
  //   <h1>Operator</h1>
  //   <input
  //     type="text"
  //     className="border border-sky-500 rounded-md py-3 px-5 my-2"
  //     value={message}
  //     onChange={(e) => setMessage(e.target.value)}
  //   />
  //   <button className="bg-sky-500 py-5 px-3 rounded-md" onClick={sendMessage}>
  //     Send Message
  //   </button>

  //   <div>
  //     <input
  //       type="number"
  //       className="border border-sky-500 rounded-md py-3 px-5 my-2"
  //       placeholder="Countdown duration (seconds)"
  //       value={countdownDuration}
  //       onChange={(e) => setCountdownDuration(parseInt(e.target.value))}
  //     />
  //     <button
  //       className="bg-sky-500 py-5 px-3 rounded-md"
  //       onClick={startCountdown}
  //     >
  //       Start Countdown
  //     </button>
  //   </div>
  // </div>
  // );
}

export default OperatorApp;
