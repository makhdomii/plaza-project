import fs from 'fs';

const ws = require('ws');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data.db', (err) => {
  if (err) {
    console.log('Error Opening Database: ', err.message);
  } else {
    console.log('Connected to the DB');
  }
});

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
wss.on('connection', (socket) => {
  socket.on('message', (message) => {
    let totalReferee = Object.keys(referees).length;
    let totalClient = Object.keys(clients).length;
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
    if (type === 'playContest') {
      pauseGame = false;
    }
    if (type === 'pauseContest') {
      pauseGame = true;
    }
    if (pauseGame) {
      return;
    }

    if (type === 'startContest') {
      letClientAnswer = true;
    }
    if (type === 'pullDownSSg') {
      hardware['1'].ws.send('a');
    }
    if (type === 'moveBox') {
      hardware['2'].ws.send('b');
    }
    if (type === 'boxOnA') {
      hardware['2'].ws.send('c');
    }
    if (type === 'boxOnB') {
      hardware['2'].ws.send('d');
    }
    if (type === 'openBox') {
      hardware['2'].ws.send('e');
    }
    function showSevenSegmentNumbers() {
      Object.keys(sevenSegments).forEach((item) => {
        if (sevenSegments[item].deviceId === '1') {
          sevenSegments[item].ws.send(totalB);
        }
        if (sevenSegments[item].deviceId === '2') {
          sevenSegments[item].ws.send(totalA);
        }
      });
    }
    function calculateTotals() {
      Object.keys(referees).forEach((item) => {
        const totalAnswers = referees[item].answer ?? [];
        totalAnswerA += totalAnswers.filter((s) => s === 'a').length;
        totalAnswerB += totalAnswers.filter((s) => s === 'b').length;
      });
      Object.keys(clients).forEach((item) => {
        if (clients[item].answer === 'a')
          totalClientAnswerA = totalClientAnswerA + 1;
        if (clients[item].answer === 'b')
          totalClientAnswerB = totalClientAnswerB + 1;
      });
    }
    // const messageType = {
    //   registerClient: () => {},
    //   answerClient: () => {},
    //   registerHardware: () => {},
    //   registerSevenSegment: () => {},
    //   registerOperator: () => {},
    //   registerReferee: () => {},
    //   answerReferee: () => {},
    //   setTotalNumOperator: () => {},
    //   SetNumOperator: () => {},
    //   generateFake: () => {},
    // };
    if (type === 'registerClient') {
      const userId = 'client_' + generateId();
      clients[userId] = { ws: socket, userId, deviceId, answer: null };
    }
    if (type === 'answerClient' && letClientAnswer) {
      // if (
      //   clients[deviceId] &&
      //   clients[deviceId].answer &&
      //   typeof clients[deviceId].answer === 'string'
      // ) {
      //   return;
      // } else {

      if (deviceId && clients[deviceId] && clients[deviceId].answer) {
        return;
      }
      const answer = msg[5];
      // if (answer === 'b') totalClientAnswerB++;
      // if (answer === 'a') totalClientAnswerA++;
      clients[deviceId] = {
        ws: socket,
        deviceId: msg.id,
        answer,
        latestUpdate: new Date(),
      };
      // }
    }

    if (type === 'registerHardware') {
      hardware.deviceId = { deviceId, ws: socket };
      console.log('hardware connected');
    }
    if (type === 'registerSevenSegment') {
      const userId = 'ssg_' + generateId();
      sevenSegments[userId] = { ws: socket, deviceId, userId };
      if (totalA > 0 || totalB > 0) {
        console.log('segment number should update');
        showSevenSegmentNumbers();
      }
    }
    if (type === 'registerOperator') {
      const userId = 'operator_' + generateId();
      operator[userId] = { ws: socket, userId };
    }
    if (type === 'registerReferee') {
      const userId = 'referee_' + generateId();
      referees[deviceId] = { ws: socket, deviceId: deviceId, userId };
    }
    if (type === 'answerReferee') {
      const answer = msg[5];
      if (answer === 'b') totalB++;
      if (answer === 'a') totalA++;
      let answers = referees[deviceId].answer
        ? [...referees[deviceId].answer, answer]
        : [answer];
      referees[deviceId] = {
        ws: socket,
        deviceId: msg.id,
        answer: answers,
      };
      showSevenSegmentNumbers();
    }
    const plusObj = {
      numB: (t) => {
        totalB = t;
      },
      numA: (t) => {
        totalA = t;
      },
    };

    if (type === 'setTotalNumOperator') {
      const a = msg[3];
      const b = msg[5];
      const totalAInterval = setInterval(() => {
        if (Number(totalA) === Number(a)) {
          clearInterval(totalAInterval);
          return;
        } else {
          console.log('interval started');
          plusObj['numA'](totalA++);
          showSevenSegmentNumbers();
        }
      }, 500);
      setInterval(() => {
        if (Number(totalB) === Number(b)) {
          // clearInterval(totalBInterval);
          return;
        } else {
          plusObj['numB'](totalB++);
          showSevenSegmentNumbers();
        }
      }, 500);
      // plusObj['numB'](b);
    }
    if (type === 'SetNumOperator') {
      const t = msg[3];
      const numberType = msg[2];

      plusObj[numberType](t);
      showSevenSegmentNumbers();
    }
    calculateTotals();
    syncOperator(
      JSON.stringify({
        type: 'syncTotal',
        total: totalReferee + totalClient,
        totalA,
        totalB,
        totalClient,
        totalReferee,
        totalRefereeAnswerA: totalAnswerA,
        totalRefereeAnswerb: totalAnswerB,
        totalClientAnswerA,
        totalClientAnswerB,
      })
    );
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
