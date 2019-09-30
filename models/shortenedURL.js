const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  longURL: {
    type: String,
    required: true
  },
  shortURL: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model('url', urlSchema);
