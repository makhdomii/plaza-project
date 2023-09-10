import { useEffect, useState } from 'react';
import { Container, AnswerBox } from '../components';
import logo from '../assets/logo.png';

const ws = new WebSocket('ws://192.168.10.100:4000');
// const ws = new WebSocket('ws://localhost:4000');

type LEDType = {
  num: number;
  setNum: (answer: number) => void;
  color: string;
};
const LED = ({ setNum, num, color }: LEDType) => {
  const [number, setNumber] = useState(num);
  useEffect(() => {
    setNumber(num);
  }, [num, number]);
  return (
    <div>
      <div
        className="flex ml-7 rounded-2xl overflow-hidden justify-center items-center bg-dark-200"
        style={{ backgroundColor: color }}
      >
        <button
          className="px-5 py-3 text-5xl bg-grape-50 hover:bg-opacity-70 hover:shadow-md"
          onClick={() => {
            setNum(number + 1);
            setNumber(number + 1);
          }}
        >
          +
        </button>
        <div className={'px-5 py-3 text-3xl text-[#fff]'}>{number}</div>
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

const manageContest = [
  // {
  //   name: 'شروع برنامه جدید',
  //   socketMessage: "'type':'pauseContest'",
  //   color: 'bg-[#017338] ',
  // },

  {
    name: 'پایین آمدن شمارشگر',
    socketMessage: "'type':'pullDownSSg'",
    color: 'bg-[#017338] ',
  },
  {
    name: 'باز شدن جعبه',
    socketMessage: "'type':'openBox'",
    color: 'bg-[#017338] ',
  },
  {
    name: 'شروع حرکت جعبه',
    socketMessage: "'type':'boxOnA'",
    color: 'bg-blue-600 ',
  },
  {
    name: 'توقف حرکت جعبه',
    socketMessage: "'type':'boxOnB'",
    color: 'bg-red-600 ',
  },
];
const mngContest = [
  {
    name: 'نگه داشتن مسابقه',
    socketMessage: "'type':'pauseContest'",
    color: 'bg-[#017338] ',
  },
  {
    name: 'ادامه مسابقه',
    socketMessage: "'type':'playContest'",
    color: 'bg-[#017338] ',
  },
  {
    name: 'شروع رای گیری',
    socketMessage: "'type':'startContest'",
    color: 'bg-[#017338] ',
  },
  {
    name: 'شعله ورود',
    socketMessage: "'type':'moveBox'",
    color: 'bg-[#017338] ',
  },
];
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
  const [devices, setDevices] = useState({
    hardware: 0,
    sevenSegments: 0,
    operator: 0,
    client: 0,
    referee: 0,
  });
  const [refereeOne, setRefereeOne] = useState({ red: 0, blue: 0 });
  const [refereeTwo, setRefereeTwo] = useState({ red: 0, blue: 0 });
  const [refereeThree, setRefereeThree] = useState({ red: 0, blue: 0 });
  ws.onopen = (event) => {
    console.log('open socket', event);
    ws.send("'type':'registerOperator'");
  };

  ws.onmessage = (message) => {
    const msg = JSON.parse(message.data);
    if (msg.type === 'syncRegisters') {
    }
    if (msg.type === 'syncTotal') {
      console.log(msg);
      Object.keys(msg.refereeObj).forEach((item) => {
        const filterA = msg.refereeObj[item]?.answer?.a;
        const filterB = msg.refereeObj[item]?.answer?.b;
        if (Number(item) === 3)
          setRefereeThree({ red: filterB, blue: filterA });
        if (Number(item) === 2) setRefereeTwo({ red: filterB, blue: filterA });
        if (Number(item) === 1) setRefereeOne({ red: filterB, blue: filterA });
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
  };
  ws.onerror = (event) => {
    console.log('error => ', event);
  };
  ws.onclose = (event) => {
    let reason;
    // alert(event.code);
    // See https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1
    if (event.code === 1000)
      reason =
        '1000 indicates a normal closure, meaning that the purpose for which the connection was established has been fulfilled.';
    else if (event.code === 1001)
      reason =
        '1001 indicates that an endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
    else if (event.code === 1002)
      reason =
        '1002 indicates that an endpoint is terminating the connection due to a protocol error';
    else if (event.code === 1003)
      reason =
        '1003 indicates that an endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).';
    else if (event.code === 1004)
      reason = 'Reserved. The specific meaning might be defined in the future.';
    else if (event.code === 1005)
      reason = 'No status code was actually present.';
    else if (event.code === 1006)
      reason =
        'The connection was closed abnormally, e.g., without sending or receiving a Close control frame';
    else if (event.code === 1007)
      reason =
        'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).';
    else if (event.code === 1008)
      reason =
        'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
    else if (event.code === 1009)
      reason =
        'An endpoint is terminating the connection because it has received a message that is too big for it to process.';
    else if (event.code === 1010)
      // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
      reason =
        "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " +
        event.reason;
    else if (event.code === 1011)
      reason =
        'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
    else if (event.code === 1015)
      reason =
        "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
    else reason = 'Unknown reason';
    console.error('closed => ', reason);
  };
  return (
    <>
      <div className="flex justify-center">
        <img src={logo} className="w-52" alt="" />
      </div>
      <div className={'py-3'}>
        <Container className="pb-5">
          <div className="flex flex-wrap">
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
            {/* </div>
          <div className="flex pt-8"> */}
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
      <Container className="flex flex-wrap">
        <div className={'bg-[#fbb017] py-5 md:w-full lg:w-1/2'}>
          <p className="pb-5 text-lg">تنظیمات نمایشگر</p>
          <div className="pb-5 text-center">
            <div className="flex justify-center pb-10">
              <LED
                num={total.totalA}
                setNum={function (answerA: number) {
                  ws.send(`{'type':'SetNumOperator', 'numA':'${answerA}'}`);
                }}
                color="#1d5d9b"
              />
              <LED
                num={total.totalB}
                setNum={function (answerA: number) {
                  ws.send(`{'type':'SetNumOperator', 'numB':'${answerA}'}`);
                }}
                color="#f31559"
              />
            </div>
            <form
              className="inline-block"
              onSubmit={(event) => {
                event.preventDefault();
                const { red, blue } = event.currentTarget;
                const redInput = red.value === '' ? total.totalB : red.value;
                const blueInput = blue.value === '' ? total.totalA : blue.value;
                let a = Number(total.totalA);
                let b = Number(total.totalB);
                const blueVal = Number(blueInput);
                const redVal = Number(redInput);
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
        </div>
        <div className={'py-5 md:w-full lg:w-1/2 bg-[#fff] flex flex-wrap'}>
          {/* <div> */}
          {manageContest.map((item, index) => {
            // const width = index < 2 ? 'w-1/2' : 'w-1/3';
            const width = 'calc(50% - 10px)';
            return (
              <button
                key={'game_management_btn_' + index}
                onClick={(e) => {
                  e.currentTarget.classList.toggle('bg-opacity-30');
                  ws.send(item.socketMessage);
                }}
                style={{ width }}
                className={`${item.color} py-8 my-1 px-5 mx-1 text-[#fff] hover:bg-opacity-70 focus:transition active:scale-95 active:bg-green-100 active:bg-opacity-10 ease-out`}
              >
                {item.name}
              </button>
            );
          })}
          {/* </div> */}
          {/* <div>
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
          </div> */}
        </div>
      </Container>
      <Container className="">
        <div className="flex w-full justify-between">
          {mngContest.map((item, index) => {
            const width = 'calc(25% - 30px)';
            return (
              <button
                key={'game_management_btn_' + index}
                id={'manageContest_id_' + index}
                onClick={(e) => {
                  if (index < 3) {
                    const target = e.currentTarget.classList;
                    target.add('bg-opacity-80');
                    target.add('bg-red-800');
                    target.add('hover:bg-opacity-90');
                  }
                  if (index === 0) {
                    const secondItem =
                      document.getElementById('manageContest_id_1')?.classList;
                    secondItem?.remove('bg-opacity-30');
                    secondItem?.remove('bg-red-800');
                    secondItem?.add('hover:bg-opacity-90');
                  }
                  if (index === 1) {
                    const firstItem =
                      document.getElementById('manageContest_id_0')?.classList;
                    firstItem?.remove('bg-opacity-30');
                    firstItem?.remove('bg-red-800');
                    firstItem?.add('hover:bg-opacity-90');
                  }
                  ws.send(item.socketMessage);
                }}
                style={{ width }}
                className={`bg-blue-500 py-8 mx-1 px-5 text-[#fff] hover:bg-opacity-90 focus:transition active:scale-95 active:bg-green-100 active:bg-opacity-10 ease-out`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </Container>
      <div className="absolute right-0 top-0">
        <button
          onClick={() => {
            ws.send("'type':'resetContest'");
          }}
          className={`bg-red-700 py-8 px-5 text-[#fff] hover:bg-opacity-90 focus:transition active:scale-95 active:bg-green-100 active:bg-opacity-10 ease-out`}
        >
          شروع مسابقه جدید
        </button>
      </div>
    </>
  );
}

export default App;
