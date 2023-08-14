import { useEffect } from 'react';
import { Container } from '../components';

export function App() {
  // const []
  const ws = new WebSocket('ws://127.0.0.1:4040');
  useEffect(() => {
    ws.onopen = (event) => {
      console.log('open socket', event);
      ws.send('operator');
    };
    ws.onmessage = (message) => {
      console.log(message);
      // const answers = JSON.parse(message.data);
      // console.log(answers);
      // console.log('socket message', answers);
    };
    // return () => {
    //   ws.close();
    // };
  }, []);
  return (
    <Container>
      <button
        onClick={() => {
          ws.send('handshake:1');
        }}
      >
        click me
      </button>
    </Container>
  );
}

export default App;
