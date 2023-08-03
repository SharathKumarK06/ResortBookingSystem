const mongoose = require('mongoose');

const File = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },


});
