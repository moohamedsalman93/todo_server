import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccount from './config/serviceAccountKey.json' assert { type: 'json' };

dotenv.config();


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "todo-ee566.appspot.com"
});


connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
