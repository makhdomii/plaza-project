const ws = require('ws');
const http = require('http');
// const Datababase = require('better-sqlite3')
// import a from '../../../'
// const db = new Datababase('../../../contestDb.db')
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
    console.log(type, deviceId, msg);
    let totalAnswerA = 0;
    let totalAnswerB = 0;
    let totalClientAnswerA = 0;
    let totalClientAnswerB = 0;
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
    calculateTotals();
    if (type === 'registerSevenSegment') {
      console.log('register seven segment');
      const userId = 'ssg_' + generateId();
      sevenSegments[userId] = { ws: socket, deviceId, userId };
    }
    if (type === 'registerOperator') {
      console.log('operator registered !');
      const userId = 'operator_' + generateId();
      operator[userId] = { ws: socket, userId };
    }
    if (type === 'registerReferee') {
      const userId = 'referee_' + generateId();
      referees[deviceId] = { ws: socket, deviceId: deviceId, userId };
    }
    if (type === 'answerReferee') {
      const answer = msg[5];
      let answers = referees[deviceId].answer
        ? [...referees[deviceId].answer, answer]
        : [answer];
      referees[deviceId] = {
        ws: socket,
        deviceId: msg.id,
        answer: answers,
      };
      calculateTotals();
      Object.keys(sevenSegments).forEach((item) => {
        // console.log(item);
        if (sevenSegments[item].deviceId === '1') {
          console.log('seven segment light  ===>', totalAnswerB);
          sevenSegments[item].ws.send(totalAnswerB);
        }
      });
      // console.log('sevenSegments', sevenSegments);
    }

    syncOperator(
      JSON.stringify({
        type: 'syncTotal',
        total: totalReferee + totalClient,
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
