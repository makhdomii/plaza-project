import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io'; // Import Server from socket.io

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  allowEIO3: true,
});

const port = process.env.CHATPORT ? Number(process.env.CHATPORT) : 4040;

const users = new Set();

io.on('connection', (socket) => {
  socket.on('operatorJoin', (e) => {
    const userOnlineList = Array.from(users);
    socket.join('operators');
    socket.emit('updateUsers', userOnlineList);
  });
  socket.on('refereeJoin', (e) => {
    users.add(JSON.stringify({ name: e, id: socket.id }));
    const userOnlineList = Array.from(users);
    socket.join('referees');

    io.to('operators').emit('updateUsers', userOnlineList);
  });

  socket.on('sendMessage', (e) => {
    const targetSocketId = Array.from(users).find(
      (item: string) => JSON.parse(item).id === e.id
    );
    if (targetSocketId) {
      io.to(e.id).emit('operatorMessage', e.message);
    }
    // console.log(message);
    // // Send a message to all referees in the "referees" room
    // io.to(message.id).emit('messageToReferees', message);
  });

  const timerFunction = (id, action) => {
    const targetSocketId = Array.from(users).find(
      (item: string) => JSON.parse(item).id === id
    );
    if (targetSocketId) {
      io.to(id).emit(action);
    }
  };
  socket.on('startTimer', (id) => timerFunction(id, 'play'));
  socket.on('pauseTimer', (id) => timerFunction(id, 'pause'));
  socket.on('stopTimer', (id) => timerFunction(id, 'stop'));
  socket.on('disconnect', async (e) => {
    console.log('disconnect !', e);
    const userToRemove = Array.from(users).find(
      (user: string) => JSON.parse(user).id === socket.id
    );

    if (userToRemove) {
      console.log('remove user !');
      await users.delete(userToRemove);
      const userOnlineList = await Array.from(users);
      console.log(userOnlineList);
      io.to('operators').emit('updateUsers', userOnlineList);
    }
  });
});

app.use(express.json());
app.use(cors());
server.listen(port, () => {
  console.log('Server is listening on port ' + port);
});
