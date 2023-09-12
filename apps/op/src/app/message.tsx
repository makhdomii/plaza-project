import React, { FormEvent, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import logo from '../assets/logo.png';
import { ClientList } from './clientList';

const MemoizedClientList = React.memo(ClientList);
function OperatorApp() {
  const [clientList, setClientList] = useState(new Set());
  const [clientListArray, setClientListArray] = useState<
    { clientId: string }[]
  >([]);
  const ws: Socket = io('http://192.168.10.100:4040');
  let clientListLet: any = [];
  useEffect(() => {
    // Handle the 'connect' event
    ws.on('connect', () => {
      console.log('Socket.io connected');
      ws.emit('registerOperator', 'hello world');
      // ws.emit('registerOperator'); // Send the registration message
    });
    return () => {
      // Clean up the socket connection when the component unmounts
      ws.disconnect();
    };
  }, [ws]);

  ws.on('registerClient', (message) => {
    console.log('message ===>', message);
    clientListLet = message;
    setClientListArray(message);
  });
  // Handle errors
  ws.on('error', (error) => {
    console.error('Socket.io error', error);
  });

  // Handle disconnection
  ws.on('disconnect', () => {
    console.log('Socket.io disconnected');
  });

  const sendMessage = (e: FormEvent<EventTarget>) => {
    e.preventDefault();
    const { textBox, user } = e.currentTarget as HTMLFormElement;
    const messageObj = {
      type: 'operatorMessage',
      message: textBox.value,
      user: user.value,
    };
    ws?.emit('sendMessage', messageObj);
    textBox.value = '';
  };

  const pauseCountdown = (id: string) => {
    const countdownObj = {
      type: 'pauseTimer',
      user: id,
    };
    ws?.emit('sendMessage', countdownObj);
  };
  const startCountdown = (id: string) => {
    const countdownObj = {
      type: 'startTimer',
      user: id,
    };
    ws?.emit('sendMessage', countdownObj);
  };

  const stopCountdown = (id: string) => {
    const countdownObj = {
      type: 'stopTimer',
      user: id,
    };
    console.log('stop count down from operator', countdownObj);
    ws?.emit('sendMessage', countdownObj);
  };
  console.log('client list array ====>', clientListArray);
  console.log('client let array ====>', clientListLet);
  return (
    <div className="text-right flex">
      <div className="w-1/4 bg-[#017338] h-screen flex flex-col justify-center">
        {clientListArray.map((item: any, index) => {
          console.log('client list ===>', item);
          return (
            <MemoizedClientList
              key={'client_list' + index}
              data={item}
              stopCountdown={stopCountdown}
              pauseCountdown={pauseCountdown}
              startCountdown={startCountdown}
            />
          );
        })}
        {/* {Array.from(clientList).map((item: any, index: any) => {
          return (
            <MemoizedClientList
              key={'client_list' + index}
              data={item}
              stopCountdown={stopCountdown}
              pauseCountdown={pauseCountdown}
              startCountdown={startCountdown}
            />
          );
        })} */}
      </div>

      <div className="w-3/4">
        <div className="flex justify-center items-center h-screen">
          <form className="max-w-3xl w-full" onSubmit={sendMessage}>
            <img src={logo} className="w-60 mx-auto" alt="" />
            <div className="pb-10">
              <label className="w-full">
                کاربر مورد نظر خود را انتخاب کنید
              </label>
              <select
                className="w-full text-right border border-[#017338] py-3 px-8 rounded-lg"
                name="user"
              >
                {Array.from(clientList).map((item: any, index: any) => {
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

export default React.memo(OperatorApp);
