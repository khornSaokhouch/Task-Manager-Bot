const Task = require('../models/Task');
const Member = require('../models/Member');
const moment = require('moment');

module.exports = (bot) => {
    bot.command('mytasks', async (ctx) => {
        const member = await Member.findOne({ username: ctx.from.username });
        if (!member) return ctx.reply('❌ You are not registered.');

        const tasks = await Task.find({ assignedTo: member._id }).sort({ deadline: 1 });
        if (!tasks.length) return ctx.reply('✅ You have no assigned tasks.');

        let message = '📋 *Your Tasks:*\n\n';
        tasks.forEach((t,i) => {
            message += `${i+1}. *${t.title}*\n   Status: ${t.status}\n   Deadline: ${moment(t.deadline).format('YYYY-MM-DD HH:mm')}\n   Priority: ${t.priority}\n\n`;
        });
        ctx.replyWithMarkdown(message);
    });
};
