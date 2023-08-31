const mongoose = require('mongoose');

// Define a schema for the User model
const userSchema = new mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Total :{ type: Number, required: true,default:0},
  ispremium: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
