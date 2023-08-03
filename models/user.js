const mongoose = require('mongoose');
const path = require('path');

const uploadBasePath = 'uploads'; 
const idUploadBasePath = path.join(uploadBasePath, 'id'); 
const photoUploadBasePath = path.join(uploadBasePath, 'photo'); 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    minLength: 10,
    maxlength: 10,
    required: true,
    unique: true
  },
  dob: {
    type: Date,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true,
    enum: ['male', 'female', 'rathernotsay']
  },
  address: {
    type: String,
    required: true
  },
  idCardName: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['customer', 'manager']
  },
  profilePhoto: {
    type: String,
    default: 'default-profile.jpg'
  },
  id: {
    type: String,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
module.exports.uploadBasePath = uploadBasePath;
module.exports.idUploadBasePath = idUploadBasePath;
module.exports.photoUploadBasePath = photoUploadBasePath;
