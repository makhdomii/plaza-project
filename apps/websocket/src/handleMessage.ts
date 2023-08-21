// const ws = require('ws');
// const http = require('http');
// const sqlite3 = require('sqlite3').verbose();

// const db = new sqlite3.Database('data.db', (err) => {
//   if (err) {
//     console.log('Error Opening Database: ', err.message);
//   } else {
//     console.log('Connected to the DB');
//   }
// });

// const host = process.env.HOST ?? 'localhost';
// const port = process.env.WSPORT ? Number(process.env.WSPORT) : 4000;
// const server = http.createServer();
// const wss = new ws.Server({ server });
// const clients = {};
// const referees = {};
// const operator = {};
// const sevenSegments = {};
// let totalA = 0;
// let totalB = 0;
// const hardware = {};
// class WebSocketHandler {
//   private totalA = 0;
//   private totalB = 0;
//   private totalAnswerA = 0;
//   private totalAnswerB = 0;
//   private totalClientAnswerA = 0;
//   private totalClientAnswerB = 0;

//   constructor(
//     private referees: Record<string, any>,
//     private clients: Record<string, any>,
//     private sevenSegments: Record<string, any>,
//     private operator: Record<string, any>
//   ) {}

//   private showSevenSegmentNumbers() {
//     Object.keys(this.sevenSegments).forEach((item) => {
//       const segment = this.sevenSegments[item];
//       const valueToSend = segment.deviceId === '1' ? this.totalB : this.totalA;
//       segment.ws.send(valueToSend);
//     });
//   }

//   private calculateTotals() {
//     this.totalAnswerA = 0;
//     this.totalAnswerB = 0;
//     this.totalClientAnswerA = 0;
//     this.totalClientAnswerB = 0;

//     Object.keys(this.referees).forEach((item) => {
//       const totalAnswers = this.referees[item].answer || [];
//       this.totalAnswerA += totalAnswers.filter((s: string) => s === 'a').length;
//       this.totalAnswerB += totalAnswers.filter((s: string) => s === 'b').length;
//     });

//     Object.keys(this.clients).forEach((item) => {
//       const totalAnswers = this.clients[item].answer || [];
//       this.totalClientAnswerA += totalAnswers.filter(
//         (s: string) => s === 'a'
//       ).length;
//       this.totalClientAnswerB += totalAnswers.filter(
//         (s: string) => s === 'b'
//       ).length;
//     });
//   }

//   public handleMessage(message: string) {
//     const msg = message
//       .split("'")
//       .filter((item) => ![':', '{', '}', ', ', ''].includes(item));
//     const type = msg[1];
//     const deviceId = msg[3];

//     const messageType: Record<string, Function> = {
//       // Define your message type handling functions here
//       registerClient: () => {},
//       answerClient: () => {},
//       registerHardware: () => {},
//       // ... and so on
//     };

//     if (messageType[type]) {
//       messageType[type]();
//     }

//     if (type === 'answerReferee') {
//       const answer = msg[5];
//       if (answer === 'b') this.totalB++;
//       if (answer === 'a') this.totalA++;
//       const answers = this.referees[deviceId].answer
//         ? [...this.referees[deviceId].answer, answer]
//         : [answer];
//       this.referees[deviceId] = {
//         ws: socket,
//         deviceId: msg.id,
//         answer: answers,
//       };
//       this.showSevenSegmentNumbers();
//     }

//     // ... handle other message types

//     this.calculateTotals();
//     this.syncOperator(
//       JSON.stringify({
//         type: 'syncTotal',
//         total:
//           Object.keys(this.referees).length + Object.keys(this.clients).length,
//         totalA: this.totalA,
//         totalB: this.totalB,
//         totalClient: this.totalClientAnswerA + this.totalClientAnswerB,
//         totalReferee: this.totalAnswerA + this.totalAnswerB,
//         totalRefereeAnswerA: this.totalAnswerA,
//         totalRefereeAnswerB: this.totalAnswerB,
//         totalClientAnswerA: this.totalClientAnswerA,
//         totalClientAnswerB: this.totalClientAnswerB,
//       })
//     );
//   }

//   private syncOperator(message: string) {
//     Object.keys(this.operator).forEach((item) => {
//       this.operator[item].ws.send(message);
//     });
//   }

//   // ... other methods for handling specific message types
// }

// // // Example usage:
// // const handler = new WebSocketHandler(
// //   referees,
// //   clients,
// //   sevenSegments,
// //   operator
// // );
// // const message = 'your_received_message_here';
// // handler.handleMessage(message);

// wss.on('connection', (socket) => {
//   socket.on('message', (message) => {
//     const handler = new WebSocketHandler(
//       referees,
//       clients,
//       sevenSegments,
//       operator
//     );
//     const msg = 'your_received_msg_here';
//     handler.handleMessage(message);
//   });
//   socket.on('close', (e) => {
//     console.log('WebSocket client disconnected', e);
//   });
// });

// server.listen(port, () => {
//   console.log(`WebSocket server listening on port ${port}`);
// });

// function generateId() {
//   return Math.random().toString(36).substr(2, 8);
// }
