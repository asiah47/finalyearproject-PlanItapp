const express = require("express");
const router = express.Router();

// Middleware to protect routes
const redirectLogin = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/users/login');
    }
    next();
  };
  
  // View Tasks Page
  router.get('/:eventId', redirectLogin, (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.session.user.id;
  
    const tasksQuery = `
      SELECT * FROM tasks 
      WHERE event_id = ? AND event_id IN 
        (SELECT event_id FROM events WHERE user_id = ?) 
      ORDER BY due_date ASC
    `;
  
    db.query(tasksQuery, [eventId, userId], (err, taskResults) => {
      if (err) throw err;
      res.render('tasks', { tasks: taskResults, eventId });
    });
  });
  
  // Add Task
  router.post('/:eventId/add', redirectLogin, (req, res) => {
    const eventId = req.params.eventId;
    const { task_name, task_description, due_date, status } = req.body;
  
    const query = `
      INSERT INTO tasks (event_id, task_name, task_description, due_date, status)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(query, [eventId, task_name, task_description, due_date, status], (err) => {
      if (err) throw err;
      res.redirect(`/tasks/${eventId}`);
    });
  });
  
  // Edit Task (GET)
  router.get('/:eventId/edit/:taskId', redirectLogin, (req, res) => {
    const { eventId, taskId } = req.params;
  
    const query = 'SELECT * FROM tasks WHERE task_id = ? AND event_id = ?';
    db.query(query, [taskId, eventId], (err, result) => {
      if (err) throw err;
      if (result.length === 0) return res.redirect(`/tasks/${eventId}`);
      res.render('edit-task', { task: result[0], eventId });
    });
  });
  
  // Edit Task (POST)
  router.post('/:eventId/edit/:taskId', redirectLogin, (req, res) => {
    const { eventId, taskId } = req.params;
    const { task_name, task_description, due_date, status } = req.body;
  
    const query = `
      UPDATE tasks 
      SET task_name = ?, task_description = ?, due_date = ?, status = ?
      WHERE task_id = ? AND event_id = ?
    `;
  
    db.query(query, [task_name, task_description, due_date, status, taskId, eventId], (err) => {
      if (err) throw err;
      res.redirect(`/tasks/${eventId}`);
    });
  });
  
  // Delete Task
  router.post('/:eventId/delete/:taskId', redirectLogin, (req, res) => {
    const { eventId, taskId } = req.params;
  
    const query = 'DELETE FROM tasks WHERE task_id = ? AND event_id = ?';
    db.query(query, [taskId, eventId], (err) => {
      if (err) throw err;
      res.redirect(`/tasks/${eventId}`);
    });
  });
  
  module.exports = router;