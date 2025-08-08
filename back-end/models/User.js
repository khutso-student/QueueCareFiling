const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },

    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null }, 
    createdAt: { type: Date, default: Date.now }     
}, { timestamps: true }); 

module.exports = mongoose.model("User", userSchema);
