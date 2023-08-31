const mongoose = require('mongoose');
const Schema = mongoose.Schema
const User = require('./user')
const expenseSchema = new mongoose.Schema({
  Expenses: {
    type: Number,
    required: true
  },
  Purpose: {
    type: String,
    required: true
  },
  Category: {
    type: String,
    required: true
  },
  userId:{
    type:  Schema.Types.ObjectId,
    required:true,
    ref :"User"
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
