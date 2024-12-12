import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const auth = (req, res, next) => {
  // Log the incoming request headers to check if token is being passed correctly
  console.log('Request Headers:', req.headers);  // This is for debugging

  // Check if token exists in the Authorization header
  const token = req.headers['authorization']?.replace('Bearer ', ''); // Get token

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token not found',  // If token is missing
    });
  }

  try {
    // Verify the token using JWT_SECRET from the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);  // Log decoded token for debugging

    // Attach the decoded user data to the request object
    req.user = decoded;

    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error);  // Log error if the token is invalid
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',  // If token verification fails
    });
  }
};
