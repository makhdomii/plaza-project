import React, { useState, useEffect } from 'react';
// import './App.css';
// import WebSocket from 'ws';

function ClientApp({ clientId = 'client1' }) {
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('');
  const ws = new WebSocket('ws://localhost:4040');

  ws.onmessage = (event) => {
    console.log('from client =>', event.data);
    const data = JSON.parse(event.data);
    if (data.type === 'countdown') {
      console.log(data);
      setCountdown(data.remainingTime);
    } else if (data.type === 'operatorMessage') {
      setMessage(data.message);
    } else if (data.type === 'clientId') {
      // Store the client ID if needed
    }
  };

  useEffect(() => {
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'registerClient',
        })
      );
    };
  }, []);

  return (
    <div className="App">
      <h1>Client - {clientId}</h1>
      <p>Received Countdown: {countdown} seconds</p>
      <div>
        Received Message:{' '}
        <div
          dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br />') }}
        />
      </div>
    </div>
  );
}

export default ClientApp;
