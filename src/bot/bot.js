require('dotenv').config();
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const LocalSession = require('telegraf-session-local');

// === MongoDB Connection ===
let isConnected = false;
async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  }
}

// === Initialize bot ===
const bot = new Telegraf(process.env.BOT_TOKEN);

// === Local session ===
bot.use(new LocalSession({ database: 'sessions.json' }).middleware());

// === Import commands ===
const registerCommand = require('../commands/register');
const addTaskCommand = require('../commands/addtask');
const assignTaskCommand = require('../commands/assigntask');
const myTasksCommand = require('../commands/mytasks');
const completeTaskCommand = require('../commands/completetask');
const commentCommand = require('../commands/comment');

// === Register commands ===
registerCommand(bot);
addTaskCommand(bot);
assignTaskCommand(bot);
myTasksCommand(bot);
completeTaskCommand(bot);
commentCommand(bot);

// === Export serverless function ===
module.exports = async (req, res) => {
  await connectDB();

  try {
    await bot.handleUpdate(req.body, res);
    res.status(200).end();
  } catch (err) {
    console.error('❌ Telegram bot error:', err);
    res.status(500).send('Bot error');
  }
};
