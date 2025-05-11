import axios from 'axios';

const hfApiKey = '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';  // Replace with your actual key

async function generate() {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/distilgpt2',
      { inputs: "Say hi to a user." },
      {
        headers: {
          Authorization: `Bearer ${hfApiKey}`,
        },
      }
    );

    // ✅ Add this to see exactly what Hugging Face sends back
    console.log("Full response:", response.data);

    // Optional: print generated text if available
    if (response.data && response.data[0] && response.data[0].generated_text) {
      console.log("Generated text:", response.data[0].generated_text);
    } else {
      console.log("No generated_text found.");
    }

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

generate();
