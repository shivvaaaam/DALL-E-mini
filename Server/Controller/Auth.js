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
        if (!email || !password) {
            return res.status(500).json({
                success: false,
                message: "Please fill all the details",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email is not registered",
            });
        }

        const payload = {
            email: user.email,
            id: user._id,

        }

        if (await bcrypt.compare(password, user.password)) {

            let token = jwt.sign(payload, process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                })

            // user = user.toObject(); // Convert user document to plain object
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully"
            })
        } else {
            return res.status(403).json({
                success: false,
                message: "Incorrect Password",
            });
        }



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot Login, please try again later"
        })
    }
}