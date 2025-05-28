const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  deliveryInfo: {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    phone: String
  },
  status: {
    type: String,
    default: 'Food Processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  sessionId: { 
    type: String, 
    required: true, 
    unique: true 
  }
});

module.exports = mongoose.model('Order', orderSchema);
