require("dotenv").config();
const mongoose = require("mongoose");
require('./src/services/scheduler'); // Start cron jobs
require('./src/bot/bot');  

mongoose.connect(process.env.MONGO_URI) // removed useNewUrlParser and useUnifiedTopology
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
