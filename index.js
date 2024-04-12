import express from 'express';
import mongoose from 'mongoose';
import { userRoutes } from './routes/userRoutes.js';
import { thoughtRoutes } from './routes/thoughtRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());

// connect to MongoDB
mongoose.connect("mongodb+srv://corvvus:ncwkq71ce9NYomg7@cluster0.xiwc049.mongodb.net/social-network?retryWrites=true&w=majority", {
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);


// start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});