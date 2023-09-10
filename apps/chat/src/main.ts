import WebSocket from 'ws';
const express = require('express');
const http = require('http');

const app = express();
const cors = require('cors');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.CHATPORT ? Number(process.env.CHATPORT) : 4040;
app.use(cors());
const clients = {};
const operator = {};

wss.on('connection', (ws) => {
  let clientId;

  ws.on('message', (message: string) => {
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    if (parsedMessage.type === 'clientList') {
      let list = [];
      Object.keys(clients).forEach((element) => {
        if (!element.startsWith('operator_'))
          list.push({ id: element, name: clients[element].name });
      });
      ws.send(JSON.stringify({ type: 'clientList', list: list }));
    }
    if (parsedMessage.type === 'registerOperator') {
      clientId = 'operator_' + generateClientId();
      operator[clientId] = {
        ws: ws,
        countdownInterval: null,
      };
      ws.send(
        JSON.stringify({
          type: 'operator',
          id: clientId,
        })
      );
    }
    if (parsedMessage.type === 'registerClient') {
      clientId = 'client_' + generateClientId();
      clients[clientId] = {
        ws: ws,
        countdownInterval: null,
        name: parsedMessage.name,
      };
      ws.send(
        JSON.stringify({
          type: 'clientId',
          clientId: clientId,
        })
      );

      let list = [];
      Object.keys(clients).forEach((element) => {
        if (!element.startsWith('operator_'))
          list.push({ id: element, name: clients[element].name });
      });
      ws.send(JSON.stringify({ type: 'clientList', list: list }));

      // Object.keys(operator).forEach((item) => {
      //   operator[item].ws.send(
      //     JSON.stringify({
      //       type: 'registerClient',
      //       clientId: clientId,
      //     })
      //   );
      // });
    }
    if (parsedMessage.type === 'startTimer') {
      startCountdown(parsedMessage.user);
    }
    if (parsedMessage.type === 'pauseTimer') {
      pauseCountDown(parsedMessage.user);
    }
    if (parsedMessage.type === 'operatorMessage') {
      const message = parsedMessage.message;
      sendMessageToClient(parsedMessage.user, message);
    }
    if (parsedMessage.type === 'stopTimer') {
      console.log('stop count down' + parsedMessage.user);
      stopCountdown(parsedMessage.user);
    }
    if (parsedMessage.type === 'setCountdown') {
      const duration = parsedMessage.duration;
      setCountdownForClient(parsedMessage.targetClient, duration);
    }
  });

  ws.on('close', () => {
    if (clients[clientId]) {
      stopCountdown(clientId);
      delete clients[clientId];
    }
  });
});

app.use(express.json());

server.listen(port, () => {
  console.log('Server is listening on port ' + port);
});

function generateClientId() {
  return Math.random().toString(36).substr(2, 8);
}
// function pauseCountdown(clientId, duration) {
//   clearInterval(clients[clientId].countdownInterval);
// }
function startCountdown(clientId) {
  stopCountdown(clientId);
  clients[clientId].ws.send(
    JSON.stringify({
      type: 'startTimer',
    })
  );
  Object.keys(operator).forEach((item) => {
    operator[item].ws.send(
      JSON.stringify({
        type: 'startTimer',
        clientId,
      })
    );
  });
  // remainingTime++;
  // } else {
  //   clearInterval(countdownInterval);
  // }
  // }, 1000);

  // clients[clientId].countdownInterval = countdownInterval;
}

function setCountdownForClient(clientId, duration) {
  stopCountdown(clientId);
  startCountdown(clientId);
}

function pauseCountDown(clientId) {
  clients[clientId].ws.send(
    JSON.stringify({
      type: 'pauseTimer',
    })
  );
  // if (clients[clientId].countdownInterval) {
  //   clearInterval(clients[clientId].countdownInterval);
  //   clients[clientId].countdownInterval = null;
  // }
}
function stopCountdown(clientId) {
  clients[clientId].ws.send(
    JSON.stringify({
      type: 'stopTimer',
    })
  );
  // if (clients[clientId].countdownInterval) {
  //   clearInterval(clients[clientId].countdownInterval);
  //   clients[clientId].countdownInterval = null;
  // }
}

function sendMessageToClient(targetClient, message) {
  if (clients[targetClient]) {
    clients[targetClient].ws.send(
      JSON.stringify({
        type: 'operatorMessage',
        message: message,
      })
    );
  }
}
