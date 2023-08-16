const ws = require('ws');
const http = require('http');

const host = process.env.HOST ?? 'localhost';
const port = process.env.WSPORT ? Number(process.env.WSPORT) : 4000;
const server = http.createServer();
const wss = new ws.Server({ server });
const clients = {};
const referees = {};
const operator = {};

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
    // console.log(message.toString().split("'"));
    // console.log(
    //   message
    //     .toString()
    //     .split("'")
    //     .filter(
    //       (item) =>
    //         item !== ':' && item !== '{' && item !== '}' && item !== ', '
    //     )
    // );
    console.log(message.toString());
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
    }
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
    console.log('total answers ===>', totalAnswerA, totalAnswerB);
    console.log(
      'total Client answers ===>',
      totalClientAnswerA,
      totalClientAnswerB
    );
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
    // if (msg.type === 'registerClient') {
    //   clients[msg.id] = { ws: socket, deviceId: msg.id };
    // }
    // if (msg.type === 'answerClient') {
    //   clients[msg.id] = { ws: socket, deviceId: msg.id, answer: msg.answer };
    // }
    // Object.keys(operator).forEach((item) => {
    //   operator[item].ws.send(message);
    // });
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
  console.log('sync ==>', Object.keys(operator));
  console.log('sync message ==>', message);
  Object.keys(operator).forEach((item) => {
    operator[item].ws.send(message);
  });
}
