const Task = require('../models/Task');
const Member = require('../models/Member');

async function autoAssign(task) {
    // Find member with least tasks
    const members = await Member.find();
    const member = members.sort((a, b) => a.tasksAssigned.length - b.tasksAssigned.length)[0];

    // Assign task
    task.assignedTo = member._id;
    await task.save();

    // Update member's assigned tasks
    member.tasksAssigned.push(task._id);
    await member.save();

    return member;
}

// Optional: AI suggestion based on skills/workload
async function suggestMember(task) {
    const members = await Member.find();
    const skilledMembers = members.filter(m => m.skills.includes(task.priority));
    const member = skilledMembers.length ? skilledMembers[0] : members[0];
    return member;
}

module.exports = { autoAssign, suggestMember };
