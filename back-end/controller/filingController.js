const Filing = require('../models/Filing');
const generateNextFilingRow = require('../utils/generateFilingRow');

// Create patient file
const createFiling = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: user not authenticated" });
  }

  try {
    const {
      fullName,
      idNumber,
      gender,
      dateOfBirth,
      address,
      province,
      email,
      phoneNumber,
      postalCode
    } = req.body;

    const filingRow = await generateNextFilingRow();

    const newFiling = new Filing({
      fullName,
      idNumber,
      gender,
      dateOfBirth,
      address,
      province,
      email,
      phoneNumber,
      postalCode,
      filingRow,
      createdBy: req.user._id
    });

    await newFiling.save();
    res.status(201).json(newFiling);
  } catch (error) {
    console.error('Error creating filing:', error);
    res.status(500).json({ message: 'Failed to create filing.' });
  }
};

// Get all patients Files
const getAllFiles = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const files = await Filing.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "fullName email"); // only if you want creator info

    res.status(200).json(files);
  } catch (error) {
    console.error("Fetch All Files Error:", error);
    res.status(500).json({ message: "Failed to fetch Files" });
  }
};

// Find file by Id
const getFileById = async (req, res) => {
  try {
    const file = await Filing.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'Patient file not found' });
    
    res.status(200).json(file);
  } catch (error) {
    console.error("Get File By ID Error:", error);
    res.status(500).json({ message: 'Failed to fetch patient file' });
  }
};



// Update patient Filing details 
const updateFiling = async (req, res) => {
  try {
    const {
      fullName,
      idNumber,
      gender,
      dateOfBirth,
      address,
      province,
      email,
      phoneNumber,
      postalCode
    } = req.body;

    const file = await Filing.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "Patient file not found" });

    file.fullName = fullName || file.fullName;
    file.idNumber = idNumber || file.idNumber;
    file.gender = gender || file.gender;
    file.dateOfBirth = dateOfBirth || file.dateOfBirth;
    file.address = address || file.address;
    file.province = province || file.province;
    file.email = email || file.email;
    file.phoneNumber = phoneNumber || file.phoneNumber;
    file.postalCode = postalCode || file.postalCode;

    await file.save();

    res.status(200).json({ message: "File updated successfully", file });
  } catch (error) {
    console.error("Update File Error:", error);
    res.status(500).json({ message: "Failed to update File" });
  }
};


const deleteFile = async (req, res) => {
  try {
    const deleted = await Filing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Patient file not found" });

    res.status(200).json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete File" });
  }
};


module.exports = {
  createFiling,
  getAllFiles,
  getFileById,
  updateFiling,
  deleteFile
};
