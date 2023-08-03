// checks whether the environment is dev or production for the env file.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();

// routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");

// Set attributes for ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));

// MongoDB Datbase connection setup
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log("Connected to Mongoose."));

// Set router for used by express
app.use("/", indexRouter);
app.use("/users", userRouter);

// Listen the server on port 3000
app.listen(process.env.PORT || 3000, (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log("Server Started");
    }
});

