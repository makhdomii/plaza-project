import { useEffect, useState } from 'react';
import { Container, AnswerBox } from '../components';
import refreshIc from '../assets/refresh.svg';
// import './reset.css';
import classname from 'classnames';
import styles from './app.module.scss';

export function App() {
  const [refereeAnswer, setRefereeAnswer] = useState({ red: 0, blue: 0 });
  const ws = new WebSocket('ws://localhost:4000');
  useEffect(() => {
    ws.onopen = (event) => {
      console.log('open socket', event);
      ws.send('operator');
    };
    ws.onmessage = (message) => {
      const answers = JSON.parse(message.data);
      console.log(answers);
      if (answers.isReferee) setRefereeAnswer(answers);
      console.log('socket message', answers);
    };
  }, []);
  return (
    <>
      <div className={'bg-[#017338] py-8'}>
        <Container className="flex pb-5">
          <AnswerBox
            title="شرکت کنندگان"
            blue={refereeAnswer.blue}
            red={refereeAnswer.red}
          />
          <AnswerBox
            title="داوران"
            blue={refereeAnswer.blue}
            red={refereeAnswer.red}
          />
          <div className={'px-3'}>
            <p className="text-red-50 text-4xl pb-2">تعداد کل شرکت کنندگان</p>
            <div className="bg-teal-100 px-5 py-4 rounded-md">
              <p className="text-center text-3xl">14</p>
            </div>
          </div>
          <div className={'px-3'}>
            <p className="text-red-50 text-4xl pb-2">تعداد کل داوران</p>
            <div className="bg-teal-100 px-5 py-4 rounded-md">
              <p className="text-center text-3xl">14</p>
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
