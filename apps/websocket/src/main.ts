

const ws = require('ws');
const http = require('http');

const host = process.env.HOST ?? 'localhost';
const port = process.env.WSPORT ? Number(process.env.WSPORT) : 4000;
const server = http.createServer();
const wss = new ws.Server({ server });

wss.on('connection', (socket) => {
  let users = new Set();
  console.log('WebSocket client connected');

  socket.on('message', (message) => {
    const msg = message.toString();
    if (msg.includes('handshake')) {
      const userId = msg.replace('handshake:', '');
      const body = JSON.stringify({
        data: { num: userId, isReferee: false, answer: '', isOnline: true },
      });
      fetch('http://127.0.0.1:1337/api/participant', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
        .then((_res) => _res.json())
        .then((res) => {
          console.log('response =>', res);
          // if (res.error.status === 400) {
          //   fetch('http://127.0.0.1:1337/api/participants/' + userId, {
          //     method: 'PUT',
          //     mode: 'cors',
          //     headers: { 'Content-Type': 'application/json' },
          //     body,
          //   })
          //     .then((_res) => _res.json())
          //     .then((r) => {
          //       console.log('r =>',r);
          //     })
          //     .catch((err) => console.log(err));
          // }
        })
        .catch((err) => {
          console.log('error =>', err);
        });
    }
    // TODO :
    // get user id from handshake
    // get answer from user
    // get and send to answers to operation panel
    //
    if (msg === 'operator') {
      socket.send(JSON.stringify({ blue: 10, red: 12, isReferee: true }));
    }
    if (msg === 'refresh') {
      socket.send(JSON.stringify({ blue: 10, red: 12, isReferee: true }));
    }
  });
  socket.on('close', (e) => {
    console.log('WebSocket client disconnected', e);
  });
});

server.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}`);
});
