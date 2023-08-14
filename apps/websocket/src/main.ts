const ws = require('ws');
const http = require('http');

const host = process.env.HOST ?? 'localhost';
const port = process.env.WSPORT ? Number(process.env.WSPORT) : 4000;
const server = http.createServer();
const wss = new ws.Server({ server });
const clients = {};

wss.on('connection', (socket) => {
  console.log('WebSocket client connected');

  socket.on('message', (message) => {
    const msg = JSON.parse(message.toString());
    if (msg.type === 'registerClient') {
      const clientId = generateId();
      clients[clientId] = { ws: socket, deviceId: msg.id };
    }
    if (msg.type === 'answerClient') {
      Object.keys(clients).forEach((item) => {
        if (clients[item].deviceId === msg.deviceId) {
          clients[item].answer = msg.answer;
        }
      });
      wss.send(JSON.stringify(socket));
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
