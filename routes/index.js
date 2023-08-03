const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const uploadPath = path.join('public', User.idUploadBasePath);

const multer  = require('multer');
const upload = multer({
  dest: uploadPath
});

const passport = require('passport');
const initializePassport = require('../passport-config');

const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

router.use(flash());
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


initializePassport(passport, getUserByEmail, getUserById);

// Home page
router.get('/' , (req, res) => {
  res.render('index');
});

// Login Page
router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

// Get login credential and allow sessions
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/login',
  failureFlash: true
}));

// Register page
router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

// Get data from register page and add to database
router.post('/register', checkNotAuthenticated, upload.single('idcard'), checkDetails, async (req, res) => {
  let fileName = req.file != null ? req.file.filename : null
  if (!fileName) {
    console.error("[register route] " + 'No id card provided!');
    return res.render('register', { stat: "err", message: "Something went wrong. Try again!" } );
  }
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phone,
      dob: new Date(req.body.dob),
      hashedPassword: await bcrypt.hash(req.body.password, 10),
      sex: req.body.sex,
      address: req.body.address,
      idCardName: req.file.filename,
      userType: req.body.usertype
    });
  
    const newUser = await user.save();

    return res.render('login', { stat: "ok", message: "Successfully registered" });

  } catch (err) {
    console.error("[register route] " + err);
    return res.render('register', { stat: "err", message: "Something went wrong. Try again!" } );
  }
});

router.delete('/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect('/login');
})

// About Us page
router.get('/aboutus', (req, res) => {
  res.render('aboutus');
});



// Define helper methods -------------------------------------------------------
async function getUserByEmail(email) {
  try {
    if (email) {
    return await User.findOne({ email: email }).clone();
    } else {
      console.log("Email is not provided!");
    }
  } catch (err) {
    console.log("[getUserByEmail] " + err);
  }
}

async function getUserById(id) {
  try {
    if (id) {
      return await User.findOne({ id: id }).clone();
    } else {
      console.log("Id not provided!");
    }
  } catch (err) {
    console.log("[getUserById] " + err);
  }
}

async function checkDetails(req, res, next) {
  try {
    if (await User.exists({ email: req.body.email })) return res.render('register', { stat: "err", message: "Email is already in use!" });
    else {
      let data = [
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.password,
        req.body.sex,
        req.body.address,
        req.file.filename,
        req.body.usertype,
      ];

      if (data.some(e => e === null)) return res.render('register', { stat: "err", message: "Invalid data received!" } );
    }
    next()
  } catch (err) {
    console.error("[checkDetails] " + err);
    return res.render('register', { stat: "err", message: "Something went wrong. Try again!" } );
  }
}

function checkNotAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return res.redirect('/users');
  }
  return next();
}

module.exports = checkDetails;
module.exports = getUserByEmail;
module.exports = router;
