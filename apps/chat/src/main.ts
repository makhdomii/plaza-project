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

wss.on('connection', (ws) => {
  let clientId;

  ws.on('message', (message: string) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === 'clientList') {
      let list = [];
      Object.keys(clients).forEach((element) => {
        if (!element.startsWith('operator_')) list.push(element);
      });
      ws.send(JSON.stringify({ type: 'clientList', list: list }));
    }
    if (parsedMessage.type === 'registerOperator') {
      clientId = 'operator_' + generateClientId();
      clients[clientId] = {
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
      };
      ws.send(
        JSON.stringify({
          type: 'clientId',
          clientId: clientId,
        })
      );
    } else if (parsedMessage.type === 'startCountdown') {
      const duration = parsedMessage.duration;
      startCountdown(duration, parsedMessage.user);
    } else if (parsedMessage.type === 'operatorMessage') {
      const message = parsedMessage.message;
      sendMessageToClient(parsedMessage.user, message);
    } else if (parsedMessage.type === 'setCountdown') {
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

function startCountdown(duration, clientId) {
  stopCountdown(clientId);
  console.log(clientId);
  let remainingTime = duration;
  const countdownInterval = setInterval(() => {
    if (remainingTime > 0) {
      clients[clientId].ws.send(
        JSON.stringify({
          type: 'countdown',
          remainingTime: remainingTime,
        })
      );
      remainingTime--;
    } else {
      clearInterval(countdownInterval);
    }
  }, 1000);

  clients[clientId].countdownInterval = countdownInterval;
}

function setCountdownForClient(clientId, duration) {
  stopCountdown(clientId);
  startCountdown(duration, clientId);
}

function stopCountdown(clientId) {
  if (clients[clientId].countdownInterval) {
    clearInterval(clients[clientId].countdownInterval);
    clients[clientId].countdownInterval = null;
  }
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
