const express = require('express');
const multer = require('multer');
const User = require('../models/User')

const router = express.Router();
const storage = multer.multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload-profile/:id", upload.single("image"), async(req, res) => {
    try {
        const userId = req.params.id;

        if(!req.file) {
            return res.status(400).json({ error: "No image file uploaded" });
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: 'User not Found' });
        }

        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString("base64");
        const mimeType = req.file.mimetype;
        const profileImage = `data:${mimeType}; base64,${base64Image}`;

        const updateUser = await User.findByIdAndUpdate(
            userId, { profileImage }, { new: true }
        );
        res.status(200).json({ 
            message: 'Profile image uploaded successfully',
            User: updateUser
         });
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Failed tp upload profile image" });
    }
});

router.put("/:id", async(req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, role } = req.body;

        const updateUser = await User.findByIdAndUpdate(
            userId, { name, email, role }, { new: true }
        );
        if(!updateUser) {
            return res.statu(404).json({ message: 'Use not found' });
        }
        res.status(200).json({
            message: 'User profile updated successfully',
            user: updateUser,
        });
    } catch (error) {
        console.error("Updat Error:", error.message);
        res.status(500).json({ error: 'Failed to update user Profile' })
    }
});

module.exports = router;