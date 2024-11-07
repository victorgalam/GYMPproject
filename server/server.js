const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// חיבור למסד הנתונים MongoDB
const strConnect = "mongodb+srv://victorgalam2000:Victor22@projectgym.dgofc.mongodb.net/?retryWrites=true&w=majority&appName=projectGYM";
const OPT = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(strConnect, OPT)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("MongoDB connection error:", err));

// ייבוא רוטרים
const userRouter = require('./api/User/UserRoute');
const exerciseRouter = require('./api/exercise/exerciseRoute');
const registerRouter = require('./api/register/registerRoute');

// הגדרת רוטים
app.use('/api/v1/users', userRouter);
app.use('/api/v1/exercises', exerciseRouter);
app.use('/api/v1/registers', registerRouter);

// הפעלת השרת
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Running on port " + port);
});
