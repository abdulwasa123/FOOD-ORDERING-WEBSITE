// models/Food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true
},
  description: String,

  //image upload schema objects here
  name: {
    type: String, 
    required: true 
},
image: { 
    type: Buffer, 
    required: true 
},
contentType: { 
    type: String, 
    required: true 
},
});

module.exports = mongoose.model('Food', foodSchema);