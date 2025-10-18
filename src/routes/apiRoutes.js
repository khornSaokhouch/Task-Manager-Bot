const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const memberController = require('../controllers/memberController');
const commentController = require('../controllers/commentController');
const notificationController = require('../controllers/notificationController');

// Tasks
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// Members
router.post('/members', memberController.createMember);
router.get('/members', memberController.getMembers);
router.put('/members/:id', memberController.updateMember);
router.delete('/members/:id', memberController.deleteMember);

// Comments
router.post('/comments', commentController.addComment);
router.get('/comments/:taskId', commentController.getComments);

// Notifications
router.get('/notifications/:memberId', notificationController.getNotifications);

module.exports = router;
