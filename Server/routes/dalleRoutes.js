import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch';
import User from '../MongoDb/Model/User.js';
import { auth } from '../Middleware/auth.js';

dotenv.config();

const router = express.Router();

router.use(express.json()); 

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

router.route('/').post(auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.id;

    console.log("Received Prompt:", prompt);
    console.log("User ID from Auth Middleware:", userId);

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }

    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'api-key': process.env.DEEPAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: prompt }),
    });

    console.log("DeepAI API Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepAI API Error:', errorData);
      throw new Error(errorData.detail || 'Failed to generate image');
    }

    const data = await response.json();
    const deepaiImageUrl = data.output_url;

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(deepaiImageUrl);
    const cloudinaryImageUrl = cloudinaryResponse.secure_url; // Extract secure_url from Cloudinary response

    console.log('Generated Image URL from Cloudinary:', cloudinaryImageUrl);

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Update the user document with the new image URL and prompt
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { images: { prompt, photoUrl: cloudinaryImageUrl } } },
      { new: true }
    );

    if (!updatedUser) {
      console.error('User Not Found:', userId);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, photo: cloudinaryImageUrl });

  } catch (error) {
    console.error('Error in Generate Image Route:', error.message);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

export default router;
