const mongoose = require('mongoose');

const filingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  province: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phoneNumber: { type: String, required: true },
  postalCode: { type: String, required: true },
  filingRow: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Filing', filingSchema);
