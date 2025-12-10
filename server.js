require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Import routes
const authRoutes = require('./routes/AuthRouter');
const taskRoutes = require('./routes/TaskRoutes');
const groupRoutes = require('./routes/GroupRouter');
const userRoutes = require('./routes/UserRouter');

// Middlewares
const errorHandler = require('./middlewares/ErrorHandler');
const { connectDB } = require('./configs/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.use('/api/auth', require('./routes/auth'));

// ========== Routes ==========
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});