require('dotenv').config();
const { Telegraf } = require('telegraf');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Commands
bot.start((ctx) => ctx.reply('🚀 Bot is alive on Vercel!'));
bot.command('ping', (ctx) => ctx.reply('pong ✅'));

// Vercel webhook handler
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (err) {
      console.error('❌ Error handling update:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(200).send('✅ Bot is running on Vercel.');
  }
};
