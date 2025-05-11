import fetch from 'node-fetch';

// Replace with your Hugging Face API token
const HF_API_TOKEN = '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';  // Replace with your actual token

const run = async () => {
  // URL for DialoGPT model on Hugging Face
  const modelURL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";

  // Example user message
  const userMessage = "Hello, how are you?";

  // Send the request to Hugging Face API
  const response = await fetch(modelURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: userMessage
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("Error response:", errorText);  // Log the error if response is not ok
    return;
  }

  // Parse and log the response data
  const data = await response.json();
  console.log("Response:", data);  // This should contain the generated response
};

run();
