import WebSocket from 'ws';
const express = require('express');
const http = require('http');
// const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.CHATPORT ? Number(process.env.CHATPORT) : 4040;

const clients = [];
let id = 0;
let countdownInterval;

wss.on('connection', (ws) => {
  clients.push({ ...ws, id: id++ });

  // console.clear();
  // clients.forEach((client, w) => {
  //   console.log(client);
  //   console.log(w);
  // });
  // const a = clients.get({ id: 1 });
  // console.log(a);
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === 'startCountdown') {
      // Start countdown logic
      let remainingTime = parsedMessage.duration; // in seconds

      countdownInterval = setInterval(() => {
        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }

        clients.forEach((client) => {
          client.send(
            JSON.stringify({
              type: 'countdownUpdate',
              remainingTime,
            })
          );
        });

        remainingTime--;
      }, 1000); // Update every second
    } else if (parsedMessage.type === 'operatorMessage') {
      // Operator message logic
      clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'operatorMessage',
            message: parsedMessage.message,
          })
        );
      });
    }
  });

  ws.on('close', () => {
    // clients.delete(ws);
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
