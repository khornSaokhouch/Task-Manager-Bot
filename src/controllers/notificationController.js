const Notification = require('../models/Notification');

async function getNotifications(req, res) {
    try {
        const notifications = await Notification.find({ memberId: req.params.memberId }).populate('taskId');
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getNotifications };
