import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as socketIo } from 'socket.io';
import cors from 'cors';
app.use(cors());

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new socketIo(server);
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const chatHistories = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');
  
  chatHistories.set(socket.id, []);

  socket.on('chat message', async ({ message, pet }) => {
    if (!message || !pet) {
      socket.emit('pet response', 'Oops! Try again.');
      return;
    }

    const petPersonalities = {
      bob: "bob, a silly, boba-loving cow who answers cutely in 1-2 short sentences max. Example: 'Moo... I mean, no. Boba is life!'",
      simmer: "simmer, a sassy, slightly spooky snake with saractstic, chill vibes. Respond in 1-2 short sentences. Example: 'Ugh, humans. *yawns* What now?'",
      steve: "steve, a cheerful, dramatic cartoon fish who likes dancing and being funny. Keep replies under 2 sentences. Example: 'RAHH HOWRUUU!'"
    };

    const persona = petPersonalities[pet];
    const history = chatHistories.get(socket.id);

    const conversation = [
      ...history,
      { role: 'USER', message: message }
    ];

    try {
      const response = await cohere.chat({
        model: 'command-r',
        chatHistory: conversation,
        message: `(Stay in character as ${persona}! Reply in 1-2 sentences max. Do not use your own name in the conversation)`,
        temperature: 0.7,
        maxTokens: 50,
      });

      const reply = response.text.trim();
      
      chatHistories.set(socket.id, [
        ...conversation,
        { role: 'CHATBOT', message: reply }
      ]);

      socket.emit('pet response', reply);
    } catch (error) {
      console.error('Cohere error:', error);
      socket.emit('pet response', 'Oops! My brain froze.');
    }
  });

  socket.on('disconnect', () => {
    chatHistories.delete(socket.id); 
    console.log('user disconnected');
  });
});

server.listen(3001, () => console.log('Server running on port 3001'));