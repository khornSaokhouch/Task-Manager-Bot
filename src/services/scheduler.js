const cron = require('node-cron');
const Task = require('../models/Task');
const notificationService = require('./notificationService');

// Run every hour
cron.schedule('0 9 * * *', async () => {
    // Runs every day at 9:00 AM
    const tasks = await Task.find({ status: { $in: ['Pending', 'In Progress'] } }).populate('assignedTo');
    const now = new Date();
  
    tasks.forEach(async (task) => {
      if (task.assignedTo?.telegramId && task.deadline - now < 24*60*60*1000) { // less than 24h
        await bot.telegram.sendMessage(
          task.assignedTo.telegramId,
          `⏰ Reminder: Task "${task.title}" is due on ${moment(task.deadline).format('YYYY-MM-DD HH:mm')}`
        );
      }
    });
  });