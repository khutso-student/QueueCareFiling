const mongoose = require('mongoose');
const Filing = require('../models/Filing');
const User = require('../models/User')

const getDashboardStats = async (req, res) => {
  try {
    const adminId = req.user.id;
    console.log("Admin ID from middleware:", adminId);

    // Use new to construct ObjectId
    const adminObjectId = new mongoose.Types.ObjectId(adminId);

    const totalFiles = await Filing.countDocuments();
    const filesCreatedByAdmin = await Filing.countDocuments({ createdBy: adminObjectId });

    console.log("Total files in DB:", totalFiles);
    console.log("Files created by admin:", filesCreatedByAdmin);

    const femaleCount = await Filing.countDocuments({ gender: "Female" });
    const maleCount = await Filing.countDocuments({ gender: "Male" });
    const adminCount = await User.countDocuments({ role: "admin" });

    const monthlyFilesRaw = await Filing.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyFiles = monthNames.map((name, index) => {
      const monthData = monthlyFilesRaw.find(m => m._id === index + 1);
      return {
        name,
        files: monthData ? monthData.count : 0,
      };
    });

    res.status(200).json({
      totalFiles,
      filesCreatedByAdmin,
      femaleCount,
      maleCount,
      adminCount,  
      monthlyFiles,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

module.exports = getDashboardStats;
