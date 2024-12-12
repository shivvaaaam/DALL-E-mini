import express from 'express';
import {signup, login } from '../Controller/Auth.js';
import {auth} from '../Middleware/auth.js';
import User from '../MongoDb/Model/User.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get("/test", auth, (req, res)=>{
    res.json({
        success:true,
        message:"Welcome to test route",
        user: req.user,
    })
})

router.get("/myimages", auth, async(req, res) =>{
    
    try {
        const userId = req.user.id;
        console.log("userId", userId)
        const user = await User.findById(userId).select('images');

        if(!user){
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        console.log("user Images", user.images)
        res.status(200).json({ success: true, data: user.images });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})
export default router;