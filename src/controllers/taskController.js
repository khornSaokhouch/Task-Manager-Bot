const Task = require('../models/Task');

async function createTask(req, res) {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getTasks(req, res) {
    try {
        const tasks = await Task.find().populate('assignedTo').populate('subtasks');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateTask(req, res) {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteTask(req, res) {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { createTask, getTasks, updateTask, deleteTask };
