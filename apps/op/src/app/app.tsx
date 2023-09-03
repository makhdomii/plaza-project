import { useEffect, useState } from 'react';
import { Container, AnswerBox } from '../components';
import refreshIc from '../assets/refresh.svg';
// import './reset.css';
import classname from 'classnames';
import styles from './app.module.scss';
const ws = new WebSocket('ws://192.168.10.100:4000');
// const ws = new WebSocket('ws://localhost:4000');
type LEDType = {
  num: number;
  setNum: (answer: number) => void;
  title: string;
};
const LED = ({ setNum, num, title }: LEDType) => {
  const [number, setNumber] = useState(num);
  useEffect(() => {
    setNumber(num);
  }, [num, number]);
  return (
    <div>
      <p className="text-center text-xl">{title}</p>
      <div className="flex ml-7 rounded-2xl overflow-hidden justify-center items-center bg-dark-200">
        <button
          className="px-5 py-3 text-5xl bg-grape-50 hover:bg-opacity-70 hover:shadow-md"
          onClick={() => {
            setNum(number + 1);
            setNumber(number + 1);
          }}
        >
          +
        </button>
        <div className="px-5 py-3 text-3xl text-[#fff]">{number}</div>
        <button
          className="px-5 py-3 bg-grape-50 text-5xl hover:bg-opacity-70 hover:shadow-md"
          onClick={() => {
            setNum(number - 1);
            setNumber(number - 1);
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export function App() {
  const [total, setTotal] = useState({
    referee: 0,
    client: 0,
    total: 0,
    refereeA: 0,
    refereeB: 0,
    clientsA: 0,
    clientsB: 0,
    totalA: 0,
    totalB: 0,
  });
  const [refereeOne, setRefereeOne] = useState({ red: 0, blue: 0 });
  const [refereeTwo, setRefereeTwo] = useState({ red: 0, blue: 0 });
  const [refereeThree, setRefereeThree] = useState({ red: 0, blue: 0 });
  ws.onopen = (event) => {
    console.log('open socket', event);
    ws.send("'type':'registerOperator'");
  };
  // useEffect(() => {
  //   ws.send("'type':'syncOperator'");
  //   // return () => {
  //   //   ws.close();
  //   // };
  // }, []);
  ws.onmessage = (message) => {
    const msg = JSON.parse(message.data);
    console.log('operator panel ===>', message);
    console.log('msg ===>', msg);
    if (msg.type === 'syncTotal') {
      Object.keys(msg.refereeObj).forEach((item) => {
        if (Number(item) === 3) {
          const filterA = msg.refereeObj[item]?.answer?.filter(
            (i: 'a' | 'b') => i === 'a'
          );
          const filterB = msg.refereeObj[item]?.answer?.filter(
            (i: 'a' | 'b') => i === 'b'
          );
          setRefereeThree({ red: filterB.length, blue: filterA.length });
        }
        if (Number(item) === 2) {
          const filterA = msg.refereeObj[item]?.answer?.filter(
            (i: 'a' | 'b') => i === 'a'
          );
          const filterB = msg.refereeObj[item]?.answer?.filter(
            (i: 'a' | 'b') => i === 'b'
          );
          setRefereeTwo({ red: filterB.length, blue: filterA.length });
        }
        if (Number(item) === 1) {
          const filterA = msg.refereeObj[item]?.answer?.filter(
            (i: 'a' | 'b') => i === 'a'
          );
          const filterB = msg.refereeObj[item]?.answer?.filter(
            (i: 'a' | 'b') => i === 'b'
          );
          setRefereeOne({ red: filterB.length, blue: filterA.length });
        }
      });
      setTotal({
        referee: Number(msg.totalReferee),
        client: Number(msg.totalClient),
        total: Number(msg.total),
        refereeA: Number(msg.totalRefereeAnswerA),
        refereeB: Number(msg.totalRefereeAnswerb),
        clientsA: Number(msg.totalClientAnswerA),
        clientsB: Number(msg.totalClientAnswerB),
        totalA: Number(msg.totalA),
        totalB: Number(msg.totalB),
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
        <Container className="pb-5">
          <div className="flex">
            <AnswerBox
              title="شرکت کنندگان"
              blue={total.clientsA}
              red={total.clientsB}
            />
            <AnswerBox
              title="جمع کل داوران"
              blue={total.refereeA}
              red={total.refereeB}
            />
          </div>
          <div className="flex pt-8">
            <AnswerBox
              title="آقای سیرانی"
              blue={refereeOne.blue}
              red={refereeOne.red}
            />
            <AnswerBox
              title="آقای یونچی"
              blue={refereeTwo.blue}
              red={refereeTwo.red}
            />
            <AnswerBox
              title="خانم مهرنوش"
              blue={refereeThree.blue}
              red={refereeThree.red}
            />
          </div>
        </Container>
      </div>
      <div className={'bg-[#fbb017] py-10 flex'}>
        <Container>
          <p className="pb-5 text-lg">تنظیمات نمایشگر</p>
          <div className="flex justify-around pb-5 items-center">
            <div className="flex">
              <LED
                num={total.totalA}
                setNum={function (answerA: number) {
                  ws.send(`{'type':'SetNumOperator', 'numA':'${answerA}'}`);
                }}
                title="آبی"
              />
              <LED
                num={total.totalB}
                setNum={function (answerA: number) {
                  ws.send(`{'type':'SetNumOperator', 'numB':'${answerA}'}`);
                }}
                title="قرمز"
              />
            </div>
            <form
              className="inline-block"
              onSubmit={(event) => {
                event.preventDefault();
                const { red, blue } = event.currentTarget;
                if (red.value === '') {
                  alert('مقدار قرمز را وارد کنید');
                  return;
                }
                if (blue.value === '') {
                  alert('مقدار آبی را وارد کنید');
                  return;
                }
                if (Number(blue.value) + Number(red.value) > 81) {
                  alert('اعداد وارد شده بیشتر از حد مجاز میباشد');
                  return;
                }
                let a = Number(total.totalA);
                let b = Number(total.totalB);
                const blueVal = Number(blue.value);
                const redVal = Number(red.value);
                const interVal = setInterval(() => {
                  if (a < blueVal) {
                    a = a + 1;
                    ws.send(
                      `{'type':'setTotalNumOperator', 'numA':'${a}', 'numB':'${b}'}`
                    );
                  }
                  if (b < redVal) {
                    b = b + 1;
                    ws.send(
                      `{'type':'setTotalNumOperator', 'numA':'${a}', 'numB':'${b}'}`
                    );
                  }
                  if (a >= blueVal && b >= redVal) {
                    clearInterval(interVal);
                    return;
                  }
                }, 500);
                // ws.send(
                //   `{'type':'setTotalNumOperator', 'numA':'${blue.value}', 'numB':'${red.value}'}`
                // );
                red.value = '';
                blue.value = '';
              }}
            >
              <input
                placeholder="آبی"
                className="text-center py-3 px-5 rounded-md"
                type="number"
                name="blue"
              />
              <input
                placeholder="قرمز"
                className="text-center py-3 px-5 rounded-md mx-4"
                type="number"
                name="red"
              />
              <button className="bg-[#017338] py-3 px-5 rounded-md text-[#fff]">
                ثبت
              </button>
            </form>
          </div>
        </Container>
      </div>
      <div className={'py-10'}>
        <Container className="flex justify-between pb-5">
          <div>
            <button
              className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]"
              onClick={() => {
                ws.send("'type':'pauseContest'");
              }}
            >
              نگه داشتن مسابقه
            </button>
            <button
              className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]"
              onClick={() => {
                ws.send("'type':'playContest'");
              }}
            >
              ادامه مسابقه
            </button>
            <button
              className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]"
              onClick={() => {
                ws.send("'type':'startContest'");
              }}
            >
              شروع رای گیری
            </button>
            <button
              onClick={() => {
                ws.send("'type':'pullDownSSg'");
              }}
              className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]"
            >
              پایین آمدن شمارشگر
            </button>
            <button
              onClick={() => {
                ws.send("'type':'moveBox'");
              }}
              className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]"
            >
              شعله ورود
            </button>
            <button
              onClick={() => {
                ws.send("'type':'boxOnA'");
              }}
              className="bg-blue-600 py-3 px-5 mx-3 rounded-md text-[#fff]"
            >
              شروع حرکت جعبه
            </button>
            <button
              onClick={() => {
                ws.send("'type':'boxOnB'");
              }}
              className="bg-red-600 py-3 px-5 mx-3 rounded-md text-[#fff]"
            >
              توقف حرکت جعبه
            </button>
            <button
              onClick={() => {
                ws.send("'type':'openBox'");
              }}
              className="bg-[#017338] py-3 px-5 mx-3 rounded-md text-[#fff]"
            >
              باز شدن جعبه
            </button>
          </div>
        </Container>
      </div>
    </>
  );
}

export default App;
