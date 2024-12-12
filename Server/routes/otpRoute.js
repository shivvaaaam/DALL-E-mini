import express from 'express';
import Otp from '../MongoDb/Model/otp.js';
import mailSender from '../Nodemailer/mailSender.js';
import User from '../MongoDb/Model/User.js';
import { signup } from '../Controller/Auth.js';
import bcrypt from "bcrypt";

const router = express.Router();


const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

router.post('/send-otp', async (req, res) => {
  console.log('Incoming request to /send-otp:', req.body); // Logs the incoming request

  const { email } = req.body;

  if (!email) {
    console.log('Error: Email is missing in request');
    return res.status(400).json({ message: 'Email is required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('Error: Invalid email format:', email);
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Remove any existing OTP for the same email
    console.log('Removing existing OTPs for email:', email);
    await Otp.deleteMany({ email });

    // Generate OTP and save to the database
    const otp = generateOtp();
    console.log('Generated OTP:', otp);
    await Otp.create({ email, otp });

    // Send OTP via email
    console.log('Sending OTP email to:', email);
    await mailSender(email, 'Your OTP Code', `<h1>Your OTP is: ${otp}</h1>`);

    console.log('OTP sent successfully to:', email);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});



router.post('/verify-otp', async (req, res) => {
  const { email, otp, firstName, lastName, password } = req.body;

  console.log('Incoming request to /verify-otp:', req.body);

  if (!email || !otp || !firstName || !lastName || !password) {
    console.log('E',email);
    console.log('E',otp);
    console.log('E', firstName);
    console.log('E', lastName);
    console.log('E', password);
    console.log('Error: Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Verify OTP
    console.log('Verifying OTP for email:', email);
    const otpRecord = await Otp.findOne({ email, otp });
    console.log('OTP record found:', otpRecord);

    if (!otpRecord) {
      console.log('Error: Invalid or expired OTP for email:', email);
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });

    console.log('User created successfully:', user);
    res.status(200).json({ message: 'User created successfully' });

    // Remove OTP record
    await Otp.deleteOne({ email, otp });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});




export default router;
