const Filing = require('../models/Filing');
const generateNextFilingRow = require('../utils/generateFilingRow');
const User = require('../models/User');

// Create patient file
const createFiling = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const newFiling = new Filing({
      ...req.body,
      createdBy: req.user._id, // assign logged-in user
    });

    const savedFile = await newFiling.save();
    res.status(201).json(savedFile);

  } catch (error) {
    console.error("Create Filing Error:", error);

    // Duplicate ID Number handling
    if (error.code === 11000 && error.keyPattern?.idNumber) {
      return res.status(400).json({ message: "ID Number already exists." });
    }

    res.status(500).json({ message: "Failed to create file" });
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
      .populate("createdBy", "fullName email");
      console.log(JSON.stringify(files, null, 2)); 

    // Format all DOBs to YYYY-MM-DD
    const formattedFiles = files.map(file => ({
      ...file.toObject(),
      dateOfBirth: file.dateOfBirth
        ? file.dateOfBirth.toISOString().split("T")[0]
        : null
    }));

    res.status(200).json(formattedFiles);
  } catch (error) {
    console.error("Fetch All Files Error:", error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};


// Find file by ID
const getFileById = async (req, res) => {
  try {
    const file = await Filing.findById(req.params.id)
      .populate("createdBy", "fullName email");

    if (!file) {
      return res.status(404).json({ message: "Patient file not found" });
    }

    const fileObj = file.toObject();
    if (fileObj.dateOfBirth) {
      fileObj.dateOfBirth = fileObj.dateOfBirth.toISOString().split("T")[0];
    }

    res.status(200).json(fileObj);
  } catch (error) {
    console.error("Get File By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch patient file" });
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
      postalCode,
      filingRow,  // also extract filingRow here
    } = req.body;

    const file = await Filing.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "Patient file not found" });

    file.filingRow = filingRow || file.filingRow;
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



