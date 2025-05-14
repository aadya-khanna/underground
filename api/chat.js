import { CohereClient } from 'cohere-ai';

export default async (req, res) => {
  // 1. Initialize Cohere
  const cohere = new CohereClient({ 
    token: process.env.COHERE_API_KEY 
  });

  // 2. Get user input
  const { message, pet } = req.body;

  // 3. Pet personalities (customize these!)
  const personalities = {
    bob: "You're Bob the cow. Reply sarcastically about boba in 1 sentence.",
    simmer: "You're Simmer the cat. Give a sassy 1-line response.",
    steve: "You're Steve the fish. Respond excitedly in 1 sentence."
  };

  // 4. Generate response
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `${personalities[pet]}\n\nHuman: ${message}\n${pet}:`,
      maxTokens: 30,
      temperature: 0.7
    });

    // 5. Send back the reply
    res.status(200).json({
      reply: response.generations[0].text.trim()
    });
  } catch (error) {
    res.status(500).json({ error: "Pet is sleeping. Try again later." });
  }
};