import bcrypt from "bcrypt";
import User from "../MongoDb/Model/User.js"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
// import OTP from "../MongoDb/Model/otp.js";

dotenv.config();


export const signup = async (signupData) => {
    try {
      const { firstName, lastName, email, password } = signupData;
      console.log();
      
  
      if (!firstName || !lastName || !email || !password) {
        return { success: false, message: "All fields are required" };
      }
  
      // Hash the password
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (error) {
        console.error("Error while hashing password:", error);
        return { success: false, message: "Error while hashing password" };
      }
  
      // Create new user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
  
      return { success: true, message: "Account created successfully" };
  
    } catch (error) {
      console.error("Error during signup:", error);
      return { success: false, message: "Cannot signup, please try again later" };
    }
  };
  



  export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Incoming login request:", { email, password });

        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(500).json({
                success: false,
                message: "Please fill all the details",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found with email: ${email}`);
            return res.status(401).json({
                success: false,
                message: "Email is not registered",
            });
        }

        console.log("User found:", { email: user.email, id: user._id });
        console.log("Password from DB:", user.password);

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Incorrect password for email:", email);
            return res.status(403).json({
                success: false,
                message: "Incorrect Password",
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
        console.log("JWT token generated:", token);

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        user.password = undefined;
        console.log("Sending successful response with user data");
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "User logged in successfully",
        });

    } catch (error) {
        // Enhanced logging for debugging purposes
        console.error("Error during login:", error.message);
        console.error("Error stack trace:", error.stack);

        return res.status(500).json({
            success: false,
            message: "Cannot Login, please try again later",
        });
    }
};
