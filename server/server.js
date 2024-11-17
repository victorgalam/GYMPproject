const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Body:', req.body);
    next();
});

// Routes - שים לב לנתיב המעודכן
const userRouter = require('./api/User/UserRoute');  // שינינו ל-UserRoute במקום UserRoutes
app.use('/api/v1/users', userRouter);

// MongoDB connection
const strConnect = "mongodb+srv://victorgalam2000:Victor22@projectgym.dgofc.mongodb.net/?retryWrites=true&w=majority&appName=projectGYM";
const OPT = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(strConnect, OPT)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    console.log('404 - Not Found:', req.method, req.path);
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;