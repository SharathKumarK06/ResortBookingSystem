const mongoose = require('mongoose');


const resortSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  phoneNumber: {
    type: String,
    minLength: 10,
    maxlength: 10,
    required: true,
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
  avatarName: {
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
  id: {
    type: String,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
module.exports.uploadBasePath = uploadBasePath;
module.exports.avatarBasePath = avatarBasePath;
module.exports.idCardBasePath = idCardBasePath;