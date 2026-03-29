const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  address: String,
  mobile: String,
  email: String,
  supernumeraryCaps: [{
    name: { type: String, required: true },
    total: { type: Number, required: true },
    filled: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Institution', institutionSchema);
