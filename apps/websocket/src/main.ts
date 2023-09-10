import fs from 'fs';

import ws from 'ws';
import http from 'http';
// const sqlite3 = require('sqlite3').verbose();

// const db = new sqlite3.Database('data.db', (err) => {
//   if (err) {
//     console.log('Error Opening Database: ', err.message);
//   } else {
//     console.log('Connected to the DB');
//   }
// });

const host = process.env.HOST ?? 'localhost';
const port = process.env.WSPORT ? Number(process.env.WSPORT) : 4000;
const server = http.createServer();
const wss = new ws.Server({ server });
const clients = {};
const referees = {};
const operator = {};
const sevenSegments = {};
let totalA = 0;
let totalB = 0;
const hardware = {
  ws: null,
  deviceId: null,
};
let letClientAnswer = false;
let pauseGame = false;
let totalDevices = {
  hardware: 0,
  sevenSegments: 0,
  operator: 0,
  client: 0,
  referee: 0,
};
wss.on('connection', (socket) => {
  socket.on('message', (message) => {
    const totalReferee = Object.keys(referees).length;
    const totalClient = Object.keys(clients).length;
    const msg = message
      .toString()
      .split("'")
      .filter(
        (item) =>
          item !== ':' &&
          item !== '{' &&
          item !== '}' &&
          item !== ', ' &&
          item !== ',' &&
          item !== ''
      );
    const type = msg[1];
    const deviceId = msg[3];
    console.log('line 49 ==>', msg);

    let totalAnswerA = 0;
    let totalAnswerB = 0;
    let totalClientAnswerA = 0;
    let totalClientAnswerB = 0;

    function showSevenSegmentNumbers() {
      Object.keys(sevenSegments).forEach((item) => {
        if (sevenSegments[item].deviceId === '1') {
          console.log('total B ===> ', totalB);
          sevenSegments[item].ws.send(totalB);
        }
        if (sevenSegments[item].deviceId === '2') {
          console.log('total A ===> ', totalA);
          sevenSegments[item].ws.send(totalA);
        }
      });
    }
    function calculateTotalAnswers() {
      totalA = 0;
      totalB = 0;
      Object.keys(referees).forEach((item) => {
        totalA += Number(referees[item].answer.a);
        totalB += Number(referees[item].answer.b);
      });
    }
    function calculateTotals() {
      Object.keys(referees).forEach((item) => {
        totalAnswerA += Number(referees[item].answer.a);
        totalAnswerB += Number(referees[item].answer.b);
      });
      Object.keys(clients).forEach((item) => {
        if (clients[item].answer === 'a')
          totalClientAnswerA = totalClientAnswerA + 1;
        if (clients[item].answer === 'b')
          totalClientAnswerB = totalClientAnswerB + 1;
      });
    }
    const messageType = {
      registerClient: () => {
        const userId = 'client_' + generateId();
        totalDevices.client = totalDevices.client + 1;
        clients[userId] = { ws: socket, userId, deviceId, answer: null };
      },
      answerClient: () => {
        if (!letClientAnswer) return;
        if (deviceId && clients[deviceId] && clients[deviceId].answer) {
          return;
        }
        const answer = msg[5];
        clients[deviceId] = {
          ws: socket,
          deviceId,
          answer,
          latestUpdate: new Date(),
        };
      },
      registerHardware: () => {
        totalDevices.hardware = totalDevices.hardware + 1;
        hardware[deviceId] = { deviceId, ws: socket };
      },
      registerSevenSegment: () => {
        const userId = 'ssg_' + generateId();
        totalDevices.sevenSegments = totalDevices.sevenSegments + 1;
        sevenSegments[userId] = { ws: socket, deviceId, userId };
        // calculateTotalAnswers();
        showSevenSegmentNumbers();
      },
      registerOperator: () => {
        const userId = 'operator_' + generateId();
        operator[userId] = { ws: socket, userId };
        totalDevices.operator = totalDevices.operator + 1;
        syncOperator(
          JSON.stringify({
            type: 'syncTotal',
            total: totalReferee + totalClient,
            totalA,
            totalB,
            totalClient,
            refereeObj: referees,
            totalReferee,
            totalRefereeAnswerA: totalAnswerA,
            totalRefereeAnswerb: totalAnswerB,
            totalClientAnswerA,
            totalClientAnswerB,
          })
        );
      },
      registerReferee: () => {
        const userId = 'referee_' + generateId();
        totalDevices.referee = totalDevices.referee + 1;
        referees[deviceId] = {
          ws: socket,
          deviceId: deviceId,
          userId,
          answer: { a: 0, b: 0 },
        };
      },
      answerReferee: () => {
        if (pauseGame) return;
        const answer = msg[5];
        // console.log(msg[5]);
        // console.log(msg[6]);
        // console.log(msg[7]);
        // console.log(msg[8]);
        // Object.keys(referees).
        // if (answer === 'b') totalB++;
        // if (answer === 'a') totalA++;
        // const answers = referees[deviceId].answer
        //   ? [...referees[deviceId].answer, answer]
        //   : [answer];
        // referees[deviceId] = {
        //   ws: socket,
        //   deviceId,
        //   answer: answers,
        // };
        referees[deviceId].answer[msg[5]] = msg[7];
        console.log(referees[deviceId].answer);
        calculateTotalAnswers();
        showSevenSegmentNumbers();
      },
      setTotalNumOperator: () => {
        const a = msg[3];
        const b = msg[5];
        plusObj['numA'](a);
        plusObj['numB'](b);
        showSevenSegmentNumbers();
      },
      SetNumOperator: () => {
        const t = msg[3];
        const numberType = msg[2];
        console.log(numberType, t);
        plusObj[numberType](t);
        showSevenSegmentNumbers();
      },
      resetContest: () => {
        totalA = 0;
        totalB = 0;
        letClientAnswer = false;
        pauseGame = false;
        Object.keys(referees).forEach((item) => {
          referees[item].answer = { a: 0, b: 0 };
        });
        Object.keys(clients).forEach((item) => {
          clients[item].answer = '';
        });
        console.log('///////////////////////////')
        showSevenSegmentNumbers();
      },
      playContest: () => {
        pauseGame = false;
      },
      pauseContest: () => {
        pauseGame = true;
      },
      startContest: () => {
        letClientAnswer = true;
      },
      pullDownSSg: () => {
        hardware['1'].ws.send('a');
      },
      moveBox: () => {
        hardware['2'].ws.send('b');
      },
      boxOnA: () => {
        hardware['2'].ws.send('c');
      },
      boxOnB: () => {
        hardware['2'].ws.send('d');
      },
      openBox: () => {
        hardware['2'].ws.send('e');
      },
    };
    const plusObj = {
      numB: (t) => {
        totalB = t;
      },
      numA: (t) => {
        totalA = t;
      },
    };
    messageType[type]();
    calculateTotals();
    if (type.includes('register')) {
      Object.keys(operator).forEach((item) => {
        operator[item].ws.send(
          JSON.stringify({ type: 'syncRegisters', totalDevices })
        );
      });
    }
    if (!type.includes('register')) {
      syncOperator(
        JSON.stringify({
          type: 'syncTotal',
          total: totalReferee + totalClient,
          totalA,
          totalB,
          totalClient,
          refereeObj: referees,
          totalReferee,
          totalRefereeAnswerA: totalAnswerA,
          totalRefereeAnswerb: totalAnswerB,
          totalClientAnswerA,
          totalClientAnswerB,
        })
      );
    }
  });
  socket.on('close', (e) => {
    console.log('WebSocket client disconnected', e);
  });
});

server.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}`);
});

function generateId() {
  return Math.random().toString(36).substr(2, 8);
}
function syncOperator(message) {
  Object.keys(operator).forEach((item) => {
    operator[item].ws.send(message);
  });
}

// csv create functions

// function convertObjectToCSV(data: Record<string, any>[]): string {
//   const csvRows: string[] = [];

//   const headers = Object.keys(data[0]);
//   csvRows.push(headers.join(','));

//   for (const row of data) {
//     const values = headers.map((header) => {
//       const escapedValue = row[header].toString().replace(/"/g, '\\"');
//       return `"${escapedValue}"`;
//     });
//     csvRows.push(values.join(','));
//   }

//   return csvRows.join('\n');
// }
