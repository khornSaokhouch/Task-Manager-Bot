const Member = require('../models/Member');

async function createMember(req, res) {
    try {
        const member = new Member(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getMembers(req, res) {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateMember(req, res) {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(member);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteMember(req, res) {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { createMember, getMembers, updateMember, deleteMember };
