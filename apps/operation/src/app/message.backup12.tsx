import React, { useState } from 'react';
// import './App.css';
// import WebSocket from 'ws';

function OperatorApp() {
  const [selectedClient, setSelectedClient] = useState('');
  const [countdownDuration, setCountdownDuration] = useState(0);
  const [message, setMessage] = useState('');
  const ws = new WebSocket('ws://localhost:4040');

  const startCountdownForClient = () => {
    const messageObj = {
      type: 'setCountdown',
      targetClient: selectedClient,
      duration: countdownDuration,
    };
    ws.send(JSON.stringify(messageObj));
  };

  const sendMessageToClient = () => {
    const messageObj = {
      type: 'operatorMessage',
      targetClient: selectedClient,
      message: message,
    };

    fetch('http://localhost:4040/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      mode: 'cors',
      body: JSON.stringify(messageObj),
    });
  };

  return (
    <div className="App">
      <h1>Operator</h1>
      <div>
        <label>Select Client: </label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">Select a client</option>
          <option value="client1">Client 1</option>
          <option value="client2">Client 2</option>
          {/* Add more options for other clients */}
        </select>
      </div>
      <input
        type="number"
        placeholder="Countdown duration"
        value={countdownDuration}
        onChange={(e) => setCountdownDuration(parseInt(e.target.value))}
      />
      <button onClick={startCountdownForClient}>Start Countdown</button>
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessageToClient}>Send Message</button>
    </div>
  );
}

export default OperatorApp;
