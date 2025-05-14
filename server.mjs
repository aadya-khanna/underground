import express from 'express';
import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY
});

// Pet personalities
const petPersonalities = {
  bob: "a silly, boba-loving cow who answers sarcastically in 1-2 sentences.",
  simmer: "a sassy, slightly spooky cat with chill vibes. Respond briefly.",
  steve: "a cheerful, dramatic cartoon fish who likes dancing. Keep it fun and short."
};

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, pet } = req.body;
    
    if (!message || !pet) {
      return res.status(400).json({ error: 'Missing message or pet' });
    }

    const response = await cohere.generate({
      model: 'command',
      prompt: `[Character: ${petPersonalities[pet]}]\n\nHuman: ${message}\n${pet}:`,
      maxTokens: 50,
      temperature: 0.7
    });

    const reply = response.generations[0].text.trim();
    res.json({ reply });

  } catch (error) {
    console.error('Cohere error:', error);
    res.status(500).json({ error: 'AI failed to respond' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server (only for local testing)
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

// Export for Vercel
export default app;