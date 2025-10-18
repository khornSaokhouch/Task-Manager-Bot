const Member = require('../models/Member');

async function addPoints(memberId, points) {
    const member = await Member.findById(memberId);
    if(!member) return null;

    member.points += points;
    member.level = Math.floor(member.points / 100) + 1;
    member.streak += 1;
    await member.save();

    return member;
}

async function getLeaderboard() {
    const members = await Member.find().sort({ points: -1 });
    return members;
}

module.exports = { addPoints, getLeaderboard };
