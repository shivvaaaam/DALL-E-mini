import express from 'express'
import cors from 'cors'
import *as dotenv from 'dotenv'
import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'
import connectDB from './MongoDb/Connect.js'
import authRoute from './routes/user.js'
import otpRoute from './routes/otpRoute.js'
import { auth } from './Middleware/auth.js'

dotenv.config();

const app = express();
app.use(cors({
  origin: '*', // Or use 'http://localhost:5173' if you need to restrict it during development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle',auth, dalleRoutes);
app.use('/api/v1/', authRoute);
app.use('/api/v1/', otpRoute)

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from DALL.E!',
  });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGO_URL);
    const port = process.env.PORT || 8080; // Use dynamic port
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();