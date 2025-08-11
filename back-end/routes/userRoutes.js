const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    getUserById,
    updateUser

} = require('../controller/userController');

//  Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
router.get('/:id', getUserById);
router.put('/:id', updateUser);


module.exports = router;
