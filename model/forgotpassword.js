const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  expiresBy: {
    type: Date,
    required: true
  }
});

const Forgotpassword = mongoose.model('Forgotpassword', forgotPasswordSchema);

module.exports = Forgotpassword;
