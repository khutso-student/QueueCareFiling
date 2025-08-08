const express = require('express');
const router = express.Router();
const {   
    createFiling,
    getAllFiles,
    getFileById,
    updateFiling,
    deleteFile 
} = require('../controller/filingController');

const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createFiling);
router.get('/', protect, authorize('admin'), getAllFiles);
router.get('/:id', protect, getFileById);
router.put('/:id', protect, updateFiling);
router.delete('/:id', protect, deleteFile);

module.exports = router;
