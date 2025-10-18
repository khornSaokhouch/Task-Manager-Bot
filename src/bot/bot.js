require('dotenv').config();
const { Telegraf } = require('telegraf');
const LocalSession = require('telegraf-session-local');

// Import commands
const registerCommand = require('../commands/register');
const addTaskCommand = require('../commands/addtask');
const assignTaskCommand = require('../commands/assigntask');
const myTasksCommand = require('../commands/mytasks');
const completeTaskCommand = require('../commands/completetask');
const commentCommand = require('../commands/comment');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ===== Use persistent session =====
const localSession = new LocalSession({
    database: 'sessions.json',  // session storage
    property: 'session',        // accessed via ctx.session
    ttl: 3600                   // 1 hour
});
bot.use(localSession.middleware());

// ===== Register all commands =====
registerCommand(bot);
addTaskCommand(bot);
assignTaskCommand(bot);
myTasksCommand(bot);
completeTaskCommand(bot);
commentCommand(bot);

// ===== Launch bot =====
bot.launch()
    .then(() => console.log('🤖 Bot launched successfully!'))
    .catch(err => console.error('❌ Failed to launch bot:', err));

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
