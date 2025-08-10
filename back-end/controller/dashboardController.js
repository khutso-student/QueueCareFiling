const  User = require('../models/User')
const Filing = require('../models/Filing');

const getDashboardStats = async (req, res) => {
  try {
    const totalFiles = await Filing.countDocuments();
    const femaleCount = await Filing.countDocuments({ gender: "Female" });
    const maleCount = await Filing.countDocuments({ gender: "Male" });

    // Monthly files aggregation by month (0 = Jan, 1 = Feb, etc.)
    const monthlyFilesRaw = await Filing.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map aggregation result to array with month names
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
      femaleCount,
      maleCount,
      monthlyFiles,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

module.exports = getDashboardStats;
