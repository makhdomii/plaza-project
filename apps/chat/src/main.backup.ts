import WebSocket from 'ws';
import http from 'http';
// const WebSocket = require('ws');
// const http = require('http');
const port = process.env.CHATPORT ? Number(process.env.CHATPORT) : 4040;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server running');
});

const wss = new WebSocket.Server({ noServer: true });
const clients = new Map(); // Map to store WebSocket connections and their associated data

wss.on('connection', (ws) => {
  console.log('Client connected');
  const [lastKey] = [...clients].at(-1) || [];

  // Store the WebSocket connection in the clients map
  clients.set(ws, {
    id: lastKey, // Generate a unique ID for the client
  });

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Handle the message as needed
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove the WebSocket connection from the clients map
    clients.delete(ws);
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(port, () => {
  console.log(`Chat server is running on port ${port}`);
});

// Function to send a message to a specific client
function sendMessageToClient(clientId, message) {
  clients.forEach((client, ws) => {
    if (client.id === clientId && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

// Example usage: Send a message to a specific client with ID 'abc123'
sendMessageToClient('abc123', 'Hello, specific client!');
function generateUniqueId() {
  return Math.random();
}
