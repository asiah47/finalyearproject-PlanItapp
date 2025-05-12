const express = require("express");
const router = express.Router();

// View Tasks Page
router.get('/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const tasksQuery = 'SELECT * FROM tasks WHERE event_id = ? ORDER BY due_date ASC';

    db.query(tasksQuery, [eventId], (err, taskResults) => {
        if (err) throw err;
        res.render('tasks', { tasks: taskResults, eventId });
    });
});

// Add Task (POST)
router.post('/:eventId/add', (req, res) => {
    const eventId = req.params.eventId;
    const { task_name, task_description, due_date, status } = req.body;
    const query = 'INSERT INTO tasks (event_id, task_name, task_description, due_date, status) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [eventId, task_name, task_description, due_date, status], (err) => {
        if (err) throw err;
        res.redirect(`/tasks/${eventId}`);
    });
});

// Edit Task (GET)
router.get('/:eventId/edit/:taskId', (req, res) => {
    const { eventId, taskId } = req.params;
    const query = 'SELECT * FROM tasks WHERE task_id = ?';
    db.query(query, [taskId], (err, result) => {
        if (err) throw err;
        res.render('edit-task', { task: result[0], eventId });
    });
});

// Edit Task (POST)
router.post('/:eventId/edit/:taskId', (req, res) => {
    const { eventId, taskId } = req.params;
    const { task_name, task_description, due_date, status } = req.body;
    const query = 'UPDATE tasks SET task_name = ?, task_description = ?, due_date = ?, status = ? WHERE task_id = ?';

    db.query(query, [task_name, task_description, due_date, status, taskId], (err) => {
        if (err) throw err;
        res.redirect(`/tasks/${eventId}`);
    });
});

// Delete Task
router.post('/:eventId/delete/:taskId', (req, res) => {
    const { eventId, taskId } = req.params;
    const query = 'DELETE FROM tasks WHERE task_id = ?';
    db.query(query, [taskId], (err) => {
        if (err) throw err;
        res.redirect(`/tasks/${eventId}`);
    });
});

module.exports = router;
