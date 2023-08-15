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
    const msg = JSON.parse(message.toString());
    if (msg.type === 'registerOperator') {
      const opId = generateId();
      operator[opId] = { ws: socket, opId };
    }

    if (msg.type === 'registerReferee') {
      referees[msg.id] = { ws: socket, deviceId: msg.id };
    }
    if (msg.type === 'answerReferee') {
      referees[msg.id] = { ws: socket, deviceId: msg.id, answer: msg.answer };
    }
    if (msg.type === 'registerClient') {
      clients[msg.id] = { ws: socket, deviceId: msg.id };
    }
    if (msg.type === 'answerClient') {
      clients[msg.id] = { ws: socket, deviceId: msg.id, answer: msg.answer };
    }
    Object.keys(operator).forEach((item) => {
      operator[item].ws.send(message);
    });
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
