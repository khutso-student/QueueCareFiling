const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');


const transporter = nodemailer.createTransport({
    service: 'gmail', // or use your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.signup = async (req, res) => {
    try {
        console.log("🔥 Incoming signup data:", req.body); 
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        console.error('Signup Error:', error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Incorrect password' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent' });

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = Date.now() + 1000 * 60 * 15; // 15 minutes

        user.resetToken = token;
        user.resetTokenExpiry = expiry;
        await user.save();

        const resetLink = `http://localhost:5173/reset-password/${token}`;

        await transporter.sendMail({
            from: `"QueueCare" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset',
            html: `
                <p>You requested a password reset.</p>
                <p><a href="${resetLink}">Click here to reset your password</a></p>
                <p>This link will expire in 15 minutes.</p>
            `
        });

        res.status(200).json({ message: 'Reset link sent to your email', resetLink });
    } catch (error) {
        console.error("Forgot Password Error:", error.message);
        res.status(500).json({ message: 'Failed to send reset link', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // ✅ FIX: DataTransfer.now() → Date.now()
        });

        if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired' });

        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' }); // ✅ FIX: typo "Passowrd rest"
    } catch (error) {
        res.status(500).json({ message: 'Reset failed', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // ✅ FIX: typo "passowrd"
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        console.error('Get User Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};


exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};
