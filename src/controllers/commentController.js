const Comment = require('../models/Comment');

async function addComment(req, res) {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getComments(req, res) {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId }).populate('memberId');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { addComment, getComments };
