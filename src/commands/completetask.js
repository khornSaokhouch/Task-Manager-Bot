const Task = require('../models/Task');
const Member = require('../models/Member');
const gamificationService = require('../services/gamificationService');
const moment = require('moment');

module.exports = (bot) => {
    // Step 1: Show list of tasks to complete
    bot.command('completetask', async (ctx) => {
        const member = await Member.findOne({ username: ctx.from.username });
        if (!member) return ctx.reply('❌ You are not registered.');

        const tasks = await Task.find({ assignedTo: member._id, status: { $ne: 'Completed' } }).sort({ deadline: 1 });
        if (!tasks.length) return ctx.reply('✅ You have no pending tasks.');

        const buttons = tasks.map(t => [{
            text: `${t.title} (Deadline: ${moment(t.deadline).format('YYYY-MM-DD HH:mm')})`,
            callback_data: `complete_task_${t._id}`
        }]);

        ctx.reply('Select a task to mark as completed:', {
            reply_markup: { inline_keyboard: buttons }
        });
    });

    // Step 2: Handle button clicks
    bot.action(/complete_task_(.+)/, async (ctx) => {
        await ctx.answerCbQuery(); // acknowledge click

        const taskId = ctx.match[1];
        const task = await Task.findById(taskId);
        if (!task) return ctx.reply('❌ Task not found.');

        task.status = 'Completed';
        await task.save();

        if (task.assignedTo) await gamificationService.addPoints(task.assignedTo, 10);

        await ctx.editMessageText(`✅ Task "${task.title}" marked as completed! +10 points`);
    });
};
