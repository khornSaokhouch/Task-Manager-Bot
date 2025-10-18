const { Markup } = require('telegraf');
const Task = require('../models/Task');
const Member = require('../models/Member');
const moment = require('moment');

const ADMIN_IDS = process.env.ADMIN_ID ? process.env.ADMIN_ID.split(',') : [];

module.exports = (bot) => {

    // Start assigning task
    bot.command('assigntask', async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            if (!ADMIN_IDS.includes(userId)) return ctx.reply('🚫 Only admins can assign tasks.');

            const tasks = await Task.find({ status: 'Pending' });
            if (!tasks.length) return ctx.reply('❌ No pending tasks to assign.');

            const buttons = tasks.map(t => [Markup.button.callback(t.title, `assign_task_${t._id}`)]);
            await ctx.reply('Select a task to assign:', Markup.inlineKeyboard(buttons));
        } catch (err) {
            console.error(err);
            ctx.reply('❌ Failed to load tasks.');
        }
    });

    // Select a task
    bot.action(/assign_task_(.+)/, async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const taskId = ctx.match[1];
            const task = await Task.findById(taskId);
            if (!task) return ctx.reply('❌ Task not found.');

            const members = await Member.find({ role: 'Member' });
            if (!members.length) return ctx.reply('❌ No members registered.');

            const buttons = members.map(m => [Markup.button.callback(m.name, `assign_${taskId}_${m._id}`)]);
            await ctx.editMessageText(`Select a member to assign "${task.title}":`, Markup.inlineKeyboard(buttons));
        } catch (err) {
            console.error(err);
            ctx.reply('❌ Failed to select task.');
        }
    });

    // Select a member
    bot.action(/assign_(.+)_(.+)/, async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const taskId = ctx.match[1];
            const memberId = ctx.match[2];

            const task = await Task.findById(taskId);
            const member = await Member.findById(memberId);
            if (!task || !member) return ctx.reply('❌ Task or member not found.');

            task.assignedTo = member._id;
            task.status = 'In Progress';
            await task.save();

            if (!member.tasksAssigned.includes(task._id)) {
                member.tasksAssigned.push(task._id);
                await member.save();
            }

            await ctx.editMessageText(`✅ Task "${task.title}" assigned to ${member.name}.`);

            // Notify member
            if (member.telegramId) {
                try {
                    await ctx.telegram.sendMessage(
                        member.telegramId,
                        `📢 You’ve been assigned a new task!\n\n📝 *${task.title}*\n🧾 ${task.description}\n📅 Deadline: ${moment(task.deadline).format('YYYY-MM-DD HH:mm')}`,
                        { parse_mode: 'Markdown' }
                    );
                } catch {
                    ctx.reply(`⚠️ Task assigned, but ${member.name} hasn't started a chat with the bot yet.`);
                }
            }
        } catch (err) {
            console.error(err);
            ctx.reply('❌ Failed to assign task.');
        }
    });
};
