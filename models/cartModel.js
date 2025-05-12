// models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  price: { type: Number, required: true }, // ✅ REQUIRED FOR TOTAL TO BE VALID
  quantity: { type: Number, default: 1 },
  total: { type: Number, required: true }  // quantity * price
});


const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
