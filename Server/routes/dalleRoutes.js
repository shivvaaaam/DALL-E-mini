import express from 'express';
import * as dotenv from 'dotenv';
// import fetch from 'node-fetch';  // Use node-fetch to make API requests

dotenv.config();

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Route to handle image generation from text prompt
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Ensure prompt exists and is not empty
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Send request to DeepAI API to generate the image
    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'api-key': process.env.DEEPAI_API_KEY,  // Use the API key from environment variable
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: prompt }),  // Passing the prompt as text
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate image');
    }

    // Get the data from DeepAI API response
    const data = await response.json();
    const imageUrl = data.output_url;  // The URL of the generated image

    // Return the image URL as a response
    res.status(200).json({ photo: imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

export default router;
