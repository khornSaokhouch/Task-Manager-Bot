const Comment = require('../models/Comment');
const Member = require('../models/Member');
const Task = require('../models/Task');

module.exports = (bot) => {

    // Step 1: Start comment process
    bot.command('comment', async (ctx) => {
        const member = await Member.findOne({ username: ctx.from.username });
        if (!member) return ctx.reply('❌ You are not registered.');

        // Get member's tasks
        const tasks = await Task.find({ assignedTo: member._id }).sort({ deadline: 1 });
        if (!tasks.length) return ctx.reply('✅ You have no assigned tasks.');

        // Build inline buttons for task selection
        const buttons = tasks.map(t => [{ text: t.title, callback_data: `comment_task_${t._id}` }]);
        await ctx.reply('Select a task to comment on:', { reply_markup: { inline_keyboard: buttons } });
    });

    // Step 2: Handle task selection
    bot.action(/comment_task_(.+)/, async (ctx) => {
        await ctx.answerCbQuery(); // Acknowledge button press
        const taskId = ctx.match[1];

        const task = await Task.findById(taskId);
        if (!task) return ctx.reply('❌ Task not found.');

        // Store selected task in session
        ctx.session.commentTaskId = task._id;
        ctx.session.step = 'comment';
        await ctx.editMessageText(`📝 Enter your comment for task: *${task.title}*`, { parse_mode: 'Markdown' });
    });

    // Step 3: Capture comment text
    bot.on('text', async (ctx) => {
        if (ctx.session.step !== 'comment') return; // Only proceed if in comment step

        const content = ctx.message.text.trim();
        const member = await Member.findOne({ username: ctx.from.username });
        if (!member) return ctx.reply('❌ You are not registered.');

        const task = await Task.findById(ctx.session.commentTaskId);
        if (!task) return ctx.reply('❌ Task not found.');

        const comment = new Comment({ taskId: task._id, memberId: member._id, content });
        await comment.save();

        await ctx.reply(`💬 Comment added to task "${task.title}"`);

        // Clear session
        ctx.session.step = null;
        ctx.session.commentTaskId = null;
    });
};
