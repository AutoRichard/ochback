var mongoose = require('mongoose');

const TokenSchema = mongoose.model('token', new mongoose.Schema({
  access_token: {
    type: String,
    required: 'Title is required'
  },
  refresh_token: {
    type: String,
    required: 'Title is required'
  },
  createDate: {
    type: Date,
    default: Date.now
  }
}));

module.exports = TokenSchema

