const clients = {};
const referees = {};
const operator = {};
const sevenSegments = {};
let totalA = 0;
let totalB = 0;
export function handleMessage(message, socket) {
  let totalReferee = Object.keys(referees).length;
  let totalClient = Object.keys(clients).length;
  console.log(message.toString());
  const msg = message
    .toString()
    .split("'")
    .filter(
      (item) =>
        item !== ':' &&
        item !== '{' &&
        item !== '}' &&
        item !== ', ' &&
        item !== ''
    );
  const type = msg[1];
  const deviceId = msg[3];
  console.log(type, deviceId, msg);
  let totalAnswerA = 0;
  let totalAnswerB = 0;
  let totalClientAnswerA = 0;
  let totalClientAnswerB = 0;
  Object.keys(referees).forEach((item) => {
    const totalAnswers = referees[item].answer ?? [];
    totalAnswerA += totalAnswers.filter((s) => s === 'a').length;
    totalAnswerB += totalAnswers.filter((s) => s === 'b').length;
  });
  Object.keys(clients).forEach((item) => {
    const totalAnswers = clients[item].answer ?? [];
    totalClientAnswerA += totalAnswers.filter((s) => s === 'a').length;
    totalClientAnswerB += totalAnswers.filter((s) => s === 'b').length;
  });
  if (type === 'registerSevenSegment') {
    const userId = 'ssg_' + generateId();
    sevenSegments[userId] = { ws: socket, deviceId, userId };
  }
  if (type === 'registerOperator') {
    console.log('operator registered !');
    const userId = 'operator_' + generateId();
    operator[userId] = { ws: socket, userId };
  }
  if (type === 'registerReferee') {
    const userId = 'referee_' + generateId();
    referees[deviceId] = { ws: socket, deviceId: deviceId, userId };
  }
  if (type === 'answerReferee') {
    const answer = msg[5];
    let answers = referees[deviceId].answer
      ? [...referees[deviceId].answer, answer]
      : [answer];
    referees[deviceId] = {
      ws: socket,
      deviceId: msg.id,
      answer: answers,
    };
    Object.keys(sevenSegments).forEach((item) => {
      if (sevenSegments[item].deviceId === '1') {
        console.log('seven segment light');
        sevenSegments[item].ws.send('07');
      }
    });
  }

  syncOperator(
    JSON.stringify({
      type: 'syncTotal',
      total: totalReferee + totalClient,
      totalClient,
      totalReferee,
      totalRefereeAnswerA: totalAnswerA,
      totalRefereeAnswerb: totalAnswerB,
      totalClientAnswerA,
      totalClientAnswerB,
    })
  );
}
function generateId() {
  return Math.random().toString(36).substr(2, 8);
}
function syncOperator(message) {
  Object.keys(operator).forEach((item) => {
    operator[item].ws.send(message);
  });
}
