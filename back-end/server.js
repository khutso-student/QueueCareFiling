const dotenvFlow = require("dotenv-flow");
dotenvFlow.config({ node_env: process.env.NODE_ENV || "development" });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const filingRoutes = require("./routes/filingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const upload = require("./routes/upload");

// ✅ Connect to MongoDB
connectDB();

// 🔑 Allow localhost in dev, Vercel frontend in production
const allowedOrigins = [
  "http://localhost:5173",                  // dev (Vite)
  process.env.CLIENT_URL                    // prod (Vercel)
].filter(Boolean); // removes undefined if CLIENT_URL is not set

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server-to-server
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `❌ CORS blocked: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/filings", filingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/uploads", upload);

// ✅ Health check (for Render)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    mongo: !!process.env.MONGO_URI,
    clientUrl: process.env.CLIENT_URL || null,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT} (${process.env.NODE_ENV})`)
);
