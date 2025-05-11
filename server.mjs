import dotenv from 'dotenv';
import { CohereClientV2 } from 'cohere-ai';
import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';

dotenv.config();  
console.log("Loaded Cohere key:", process.env.COHERE_API_KEY);

const app = express();
const server = http.createServer(app);
const io = new socketIo(server);

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY, 
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', async ({ message, pet }) => {
    console.log(`Received message: "${message}" from pet: "${pet}"`);

    if (!message || !pet) {
      console.error('Message or Pet is undefined');
      socket.emit('pet response', 'Oops! Something went wrong. Please try again.');
      return;
    }

    const petPersonalities = {
      bob: "a silly, boba-loving cow who answers sarcastically",
      simmer: "a sassy, slightly spooky cat with chill vibes",
      steve: "a cheerful, dramatic cartoon fish who likes dancing and being funny"
    };

    const persona = petPersonalities[pet] || "a friendly animal";

    try {
      const response = await cohere.generate({
          model: 'command-r7b-12-2024',
          prompt: `You are ${persona}. Reply to this human message: "${message}"`,
          max_tokens: 100,
          temperature: 0.8,
      });
      
        const reply = response.body.generations[0].text.trim();
        console.log('Sending reply to frontend:', reply); 
        socket.emit('pet response', reply);
    
      } catch (error) {
        console.error('Error generating response:', error);
        socket.emit('pet response', 'Oops! Something went wrong.');
      }
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
