const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const filingRoutes = require('./routes/filingRoutes');

dotenv.config();
connectDB();

const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
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
app.use('/api/users', userRoutes);
app.use('/api/filings', filingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
