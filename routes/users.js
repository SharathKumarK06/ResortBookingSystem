const express = require("express");
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const checkDetails = require('./index');
const uploadPath = path.join('public', User.photoUploadBasePath);

const multer  = require('multer');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, res, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  }
});

// Profile Page
router.get('/', checkAuthenticated, async (req, res) => {
  let userEmail, reqUserObj, userObj;
  try {
    reqUserObj = await req.user;
    userEmail = reqUserObj.email;

    if (userEmail) {
      userObj = await User.findOne({ email: userEmail }).clone();
    } else {
      console.log("Email is not provided!");
    }

  } catch (err) {
    console.log('[/users] ' + err);
  }
  res.render('users/index.ejs', { user: userObj });
});

router.post('/', checkAuthenticated, upload.single('profile-photo'), checkDetails, async (req, res) => {
  let fileName = req.file != null ? req.file.filename : 'default-profile.jpg'
  try {
    let user = await getUserByEmail(req.body.email);
    for(key in req.body) {
      console.log(req.body + ": " + req.body[key]);
    }
  
    for (key in user) {
      if (user[key]) {

      }
      console.log(key + ": " + user[key]);
    }
    return;
    Object.assign(user, {
      name: req.body.name,
      phoneNumber: req.body.phone,
      hashedPassword: await bcrypt.hash(req.body.password, 10),
      address: req.body.address,
      userType: req.body.usertype
    });
    const newUser = await user.save();

    return res.render('login', { stat: "ok", message: "Successfully registered" });

  } catch (err) {
    console.error("[register route] " + err);
    return res.render('register', { stat: "err", message: "Something went wrong. Try again!" } );
  }
});


// Booking Status
router.get('/status', checkAuthenticated, (req, res) => {
res.render('users/status.ejs');
});



// Generate Invoice
router.get('/invoice', checkAuthenticated, (req, res) => {
res.render('users/status.ejs');
});

function checkAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

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

module.exports = router;
