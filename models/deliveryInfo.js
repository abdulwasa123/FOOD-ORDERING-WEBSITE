// Delivery Info Model
const mongoose = require('mongoose');

const deliveryInfoSchema = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true},
    street: { type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
    zipcode: { type: Number, required: true},
    country: { type: String, required: true},
    phone: { type: Number, required: true},
});

module.exports = mongoose.model('deliveryInfo', deliveryInfoSchema);