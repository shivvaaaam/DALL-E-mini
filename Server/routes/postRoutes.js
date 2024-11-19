import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'

import Post from '../MongoDb/Model/post.js'

dotenv.config();

const router = express.Router();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({});

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, messsage: error.messsage });
    }
})

router.route('/').post(async (req, res) => {
    try {
        const { name, prompt, photo } = req.body;

        const photoUrl = await cloudinary.uploader.upload(photo);

        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url,
        })

        res.status(200).json({ success: true, data: newPost });
    } catch (error) {
        res.status(500).json({ success: false, messsage: error.messsage })
    }
})


export default router;


