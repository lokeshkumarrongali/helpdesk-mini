require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const rateLimit = require('./middleware/rateLimit');

// Import routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const commentRoutes = require('./routes/comments');
const logRoutes = require('./routes/logs');

const app = express();

// Debugging
console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend port
  credentials: true
}));
app.use(express.json());
app.use(rateLimit); // Apply rate limiter globally BEFORE routes

// Connect Database
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/comments', commentRoutes);
app.use('/logs', logRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
