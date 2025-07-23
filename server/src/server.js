// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Post from '../models/Post';
import Like from '../models/Like';

const app = express();
const PORT =  5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://<db_username>:<db_password>@cluster0.gmrrjw4.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Example route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.delete
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
