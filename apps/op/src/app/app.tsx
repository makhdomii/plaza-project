import { useEffect, useState } from 'react';
import { Container, AnswerBox } from '../components';
import refreshIc from '../assets/refresh.svg';
// import './reset.css';
import classname from 'classnames';
import styles from './app.module.scss';
const ws = new WebSocket('ws://localhost:4000');

export function App() {
  const [total, setTotal] = useState({
    referee: 0,
    client: 0,
    total: 0,
    refereeA: 0,
    refereeB: 0,
    clientsA: 0,
    clientsB: 0,
  });
  // const [refereeAnswers, setRefereeAnswers] = useState({ a: 0, b: 0 });
  // const [refereeAnswer, setRefereeAnswer] = useState({ red: 0, blue: 0 });
  // ws.onopen = () => {
  //   ws.send(JSON.stringify({ type: 'registerOperator' }));
  // };

  ws.onopen = (event) => {
    console.log('open socket', event);
    ws.send("'type':'registerOperator'");
  };
  // useEffect(() => {
  //   return () => {
  //     ws.close();
  //   };
  // }, []);
  ws.onmessage = (message) => {
    const msg = JSON.parse(message.data);
    console.log('operator panel ===>', message);
    if (msg.type === 'syncTotal') {
      setTotal({
        referee: Number(msg.totalReferee),
        client: Number(msg.totalClient),
        total: Number(msg.total),
        refereeA: Number(msg.totalRefereeAnswerA),
        refereeB: Number(msg.totalRefereeAnswerb),
        clientsA: Number(msg.totalClientAnswerA),
        clientsB: Number(msg.totalClientAnswerB),
      });
    }
    if (msg.type === 'totalRefereeAnswer') {
      // setTotalReferee(Number(msg.totalReferee));
      // setTotalClient(Number(msg.totalClient));
    }
  };
  return (
    <>
      <div className={'bg-[#017338] py-8'}>
        <Container className="flex pb-5">
          <AnswerBox
            title="شرکت کنندگان"
            blue={total.clientsA}
            red={total.clientsB}
          />
          <AnswerBox
            title="داوران"
            blue={total.refereeA}
            red={total.refereeB}
          />
          <div className={'px-3'}>
            <p className="text-red-50 text-4xl pb-2">تعداد کل شرکت کنندگان</p>
            <div className="bg-teal-100 px-5 py-4 rounded-md">
              <p className="text-center text-3xl">{total.client}</p>
            </div>
          </div>
          <div className={'px-3'}>
            <p className="text-red-50 text-4xl pb-2">تعداد کل داوران</p>
            <div className="bg-teal-100 px-5 py-4 rounded-md">
              <p className="text-center text-3xl">{total.referee}</p>
            </div>
          </div>
          <div className={'mr-9 '}>
            <button className={'p-3 mt-8 mr-5 bg-[#fff] rounded-md'}>
              <img className="w-6" src={refreshIc} />
            </button>
          </div>
        </Container>
      </div>
      <div className={'bg-[#fbb017] py-10'}>
        <Container className="flex justify-between pb-5">
          <div>
            <p className="pb-5 text-lg">تنظیمات نمایشگر</p>
            <form>
              <input
                placeholder="آبی"
                className="text-center py-3 px-5 rounded-md"
                type="number"
              />
              <input
                placeholder="قرمز"
                className="text-center py-3 px-5 rounded-md mx-4"
                type="number"
              />
              <button className="bg-[#017338] py-3 px-5 rounded-md text-[#fff]">
                ثبت
              </button>
            </form>
          </div>
        </Container>
      </div>
      <div className={'bg-[#b71d25] py-10'}>
        <Container className="flex justify-between pb-5">
          <div>
            {/* <p className="pb-5 text-lg">تنظیمات نمایشگر</p> */}

            <button className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]">
              مرحله اول
            </button>
            <button className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]">
              مرحله دوم
            </button>
            <button className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]">
              مرحله سوم
            </button>
            <button className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]">
              مرحله چهارم
            </button>
          </div>
        </Container>
      </div>
    </>
  );
}

export default App;
