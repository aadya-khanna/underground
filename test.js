const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure your API key is correctly set in the .env file
});

async function testAPI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello!' }],
      max_tokens: 100,
      temperature: 0.7,
    });

    console.log('Response from OpenAI:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
