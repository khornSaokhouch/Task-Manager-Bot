require("dotenv").config();
const mongoose = require("mongoose");
require('./src/services/scheduler'); // cron jobs
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
require('./src/bot/bot');  

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    bot.launch().then(() => console.log("🤖 Bot running locally (polling)..."));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
