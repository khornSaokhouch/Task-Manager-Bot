const Task = require('../models/Task');
const Member = require('../models/Member');

async function memberProgress(memberId) {
    const total = await Task.countDocuments({ assignedTo: memberId });
    const completed = await Task.countDocuments({ assignedTo: memberId, status: 'Completed' });
    return { total, completed, completionRate: total ? (completed/total)*100 : 0 };
}

async function groupProgress() {
    const members = await Member.find();
    const result = [];
    for(const m of members) {
        const progress = await memberProgress(m._id);
        result.push({ member: m.name, ...progress });
    }
    return result;
}

module.exports = { memberProgress, groupProgress };
