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
// db.run(
//   `CREATE TABLE IF NOT EXISTS data(
//   id INTEGER PRIMARY KEY,
//   createdAt TEXT,
//   answers TEXT,
//   isReferee TEXT,
//   deviceId TEXT
// )`,
//   (err) => {
//     if (err) {
//       console.log('Error Creating table: ', err.message);
//     } else {
//       console.log('Table "data" created or already exists');
//     }
//   }
// );
wss.on('connection', (socket) => {
  console.log('WebSocket client connected');
  // TODO:
  // '{"type":"registerClient","deviceId":"1"}'
  // '{"type":"answerClient", "deviceId":"1", "answer":"b"}'

  // '{"type":"registerReferee","deviceId":"1"}'
  // '{"type":"answerReferee","deviceId":"1","answer":"b"}'
  socket.on('message', (message) => {
    let totalReferee = Object.keys(referees).length;
    let totalClient = Object.keys(clients).length;
    // console.log(message.toString());
    const msg = message
      .toString()
      .split("'")
      .filter(
        (item) =>
          item !== ':' &&
          item !== '{' &&
          item !== '}' &&
          item !== ', ' &&
          item !== ''
      );
    const type = msg[1];
    const deviceId = msg[3];
    // console.log(`${type} \n device id ===>`, deviceId);
    console.log(msg);

    let totalAnswerA = 0;
    let totalAnswerB = 0;
    let totalClientAnswerA = 0;
    let totalClientAnswerB = 0;
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
        const totalAnswers = clients[item].answer ?? [];
        totalClientAnswerA += totalAnswers.filter((s) => s === 'a').length;
        totalClientAnswerB += totalAnswers.filter((s) => s === 'b').length;
      });
    }

    if (type === 'registerSevenSegment') {
      const userId = 'ssg_' + generateId();
      sevenSegments[userId] = { ws: socket, deviceId, userId };
      console.log('totals ===>', totalA, totalB);
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
      console.log('SetNumOperator b===>', msg[5]);
      console.log('SetNumOperator a===>', msg[3]);
      plusObj['numA'](a);
      plusObj['numB'](b);
      showSevenSegmentNumbers();
    }
    if (type === 'SetNumOperator') {
      const t = msg[3];
      const numberType = msg[2];
      console.log('SetNumOperator ===>', numberType, t);
      plusObj[numberType](t);
      // const parsed = JSON.parse(message);
      // totalA = parsed.answerA;
      // totalB = parsed.asnwerB;
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
    if (type === 'generateFake') {
      let a = 0;
      let b = 0;
      const c = setInterval(() => {
        if (Math.random() * (5 - 1) + 1 > 3 && a < 17) {
          a++;
        }
        if (Math.random() * (5 - 1) + 1 > 3 && b < 11) {
          b++;
        }
        // 6 - 15

        syncOperator(
          JSON.stringify({
            type: 'syncTotal',
            total: totalReferee + totalClient,
            totalA,
            totalB,
            totalClient: a + b,
            totalReferee,
            totalRefereeAnswerA: totalAnswerA,
            totalRefereeAnswerb: totalAnswerB,
            totalClientAnswerA: a,
            totalClientAnswerB: b,
          })
        );
        if (a + b > 25) {
          clearInterval(c);
        }
      }, 500);
    }
  });
  socket.on('close', (e) => {
    console.log('WebSocket client disconnected', e);
    // db.close((err) => {
    //   if (err) {
    //     console.log('Error Closing db connection:', err.message);
    //   } else {
    //     console.log('Data connection closed');
    //   }
    // });
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
