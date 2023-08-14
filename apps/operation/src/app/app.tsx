import { useEffect, useState } from 'react';
import { Container, AnswerBox } from '../components';
// import './reset.css';
import classname from 'classnames';
import styles from './app.module.scss';

export function App() {
  const [refereeAnswer, setRefereeAnswer] = useState({ red: 0, blue: 0 });
  const ws = new WebSocket('ws://localhost:4000');
  useEffect(() => {
    ws.onopen = (event) => {
      console.log('open socket', event);
      ws.send('operator');
    };
    ws.onmessage = (message) => {
      const answers = JSON.parse(message.data);
      console.log(answers);
      if (answers.isReferee) setRefereeAnswer(answers);
      console.log('socket message', answers);
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
      <div className={classname(styles['answers-wrapper'])}>
        <AnswerBox
          title="شرکت کنندگان"
          blue={refereeAnswer.blue}
          red={refereeAnswer.red}
        />
        <AnswerBox
          title="داوران"
          blue={refereeAnswer.blue}
          red={refereeAnswer.red}
        />
      </div>
    </Container>
  );
}

export default App;
