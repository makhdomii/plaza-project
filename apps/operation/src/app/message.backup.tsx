import { FormEvent, useEffect } from 'react';
import { Container, RefereeBox } from '../components';

export function Message() {
  // const []
  const ws = new WebSocket('ws://127.0.0.1:4040');
  useEffect(() => {
    ws.onopen = (event) => {
      console.log('open socket', event);
      ws.send('operator');
    };
    ws.onmessage = (message) => {
      console.log(message);
    };
  }, []);
  const submitText = (e: FormEvent<EventTarget>) => {
    e.preventDefault();
    const { textBox } = e.currentTarget;
    console.log(textBox.value);
    ws.send(textBox.value);
  };
  const submitTimer = (e: FormEvent<EventTarget>) => {
    e.preventDefault();
    const { minutes, seconds } = e.currentTarget;
    console.log(minutes.value);
    console.log(seconds.value);
    // ws.send(textBox.value);
  };
  return (
    <div className="text-right flex">
      <div className="w-1/4 bg-dark-300 h-screen flex flex-col justify-center">
        {[...Array(4)].map((item, index) => {
          return (
            <div className="py-5 px-8 border-b">
              <p className="text-dark-100 text-lg">کاربر شماره {index + 1}</p>
              <form onSubmit={submitTimer}>
                <div className="flex relative">
                  <input
                    className="w-1/2 border text-center text-slate-900 border-sky-400 rounded-md py-3 px-5 my-2 ml-1"
                    name="seconds"
                    type="number"
                    placeholder="ثانیه"
                  />
                  <input
                    className="w-1/2 border text-center text-slate-900 border-sky-400 rounded-md py-3 px-5 my-2"
                    name="minutes"
                    type="number"
                    placeholder="دقیقه"
                  />
                </div>
                <button
                  className="rounded-md bg-emerald-600 text-emerald-50 py-3 px-6"
                  type="submit"
                >
                  شروع زمان
                </button>
              </form>
            </div>
          );
        })}
      </div>

      <div className="w-3/4">
        <div className="flex justify-center items-center h-screen">
          <form className="max-w-3xl w-full" onSubmit={submitText}>
            <div className="pb-10">
              <label className="w-full">
                کاربر مورد نظر خود را انتخاب کنید
              </label>
              <select className="w-full text-right border py-3 px-8 rounded-lg">
                <option value={'1'}>شماره یک</option>
                <option value={'2'}>شماره دو</option>
                <option value={'3'}>شماره سه</option>
                <option value={'4'}>شماره چهار</option>
              </select>
            </div>
            <textarea
              className="w-full border border-sky-400 rounded-md py-3 px-5 my-2"
              name="textBox"
              rows={10}
            />
            <button
              className="rounded-md bg-emerald-600 text-emerald-50 py-3 px-6"
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

export default Message;
