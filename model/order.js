const mongoose = require('mongoose');
const Schema = mongoose.Schema
const User = require('./user')
const orderSchema = new mongoose.Schema({
  OrderId: {
    type: String,
    required: true
  },
  PaymentId: {
    type: String
  },
  status: {
    type: String
  },
  userId:{
    type:  Schema.Types.ObjectId,
    required:true,
    ref : "User"
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
