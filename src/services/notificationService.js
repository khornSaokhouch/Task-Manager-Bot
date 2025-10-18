const Task = require('../models/Task');
const Member = require('../models/Member');
const Notification = require('../models/Notification');

async function sendReminder(task) {
    if(!task.assignedTo) return;
    const member = await Member.findById(task.assignedTo);
    console.log(`Reminder: ${member.name}, task "${task.title}" is due soon!`);

    const notification = new Notification({
        memberId: member._id,
        taskId: task._id,
        type: 'Reminder'
    });
    await notification.save();
}

async function sendOverdue(task) {
    if(!task.assignedTo) return;
    const member = await Member.findById(task.assignedTo);
    console.log(`Overdue Alert: ${member.name}, task "${task.title}" is overdue!`);

    const notification = new Notification({
        memberId: member._id,
        taskId: task._id,
        type: 'Overdue'
    });
    await notification.save();
}

module.exports = { sendReminder, sendOverdue };
