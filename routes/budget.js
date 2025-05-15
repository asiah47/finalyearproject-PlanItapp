const express = require("express");
const router = express.Router();

// Protect routes
const redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  next();
};

// GET: View Budget Tracker
router.get('/:eventId', redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.session.user.id;

  const eventQuery = 'SELECT * FROM events WHERE event_id = ? AND user_id = ?';
  const budgetQuery = 'SELECT * FROM budgets WHERE event_id = ?';

  db.query(eventQuery, [eventId, userId], (err, eventResult) => {
    if (err) throw err;
    if (eventResult.length === 0) return res.redirect('/landing');

    const event = eventResult[0];

    db.query(budgetQuery, [eventId], (err, budgetResults) => {
      if (err) throw err;

      const totalAllocated = budgetResults.reduce((acc, curr) => acc + parseFloat(curr.allocated_amount), 0);
      const totalSpent = budgetResults.reduce((acc, curr) => {
        return acc + (curr.actual_amount ? parseFloat(curr.actual_amount) : 0);
      }, 0);

      const progress = event.total_budget > 0 ? (totalAllocated / event.total_budget) * 100 : 0;
      const overBudget = totalAllocated > event.total_budget;

      res.render('budget-tracker', {
        budgets: budgetResults,
        totalAllocated,
        totalSpent,
        progress,
        overBudget,
        eventId,
        event
      });
    });
  });
});

// POST: Set Total Budget
router.post('/:eventId/set-total-budget', redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.session.user.id;
  const { total_budget } = req.body;

  const checkQuery = 'SELECT * FROM events WHERE event_id = ? AND user_id = ?';
  db.query(checkQuery, [eventId, userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect('/landing');

    const updateQuery = 'UPDATE events SET total_budget = ? WHERE event_id = ?';
    db.query(updateQuery, [total_budget, eventId], (err) => {
      if (err) throw err;
      res.redirect(`/budget/${eventId}`);
    });
  });
});

// POST: Add Budget Item
router.post('/:eventId/add', redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const { category_name, allocated_amount } = req.body;

  const query = 'INSERT INTO budgets (event_id, category_name, allocated_amount) VALUES (?, ?, ?)';
  db.query(query, [eventId, category_name, allocated_amount], (err) => {
    if (err) throw err;
    res.redirect(`/budget/${eventId}`);
  });
});

// GET: Edit Budget Item
router.get('/:eventId/edit/:budgetId', redirectLogin, (req, res) => {
  const { eventId, budgetId } = req.params;

  const query = 'SELECT * FROM budgets WHERE budget_id = ? AND event_id = ?';
  db.query(query, [budgetId, eventId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect(`/budget/${eventId}`);
    res.render('edit-budget', { budget: result[0], eventId });
  });
});

// POST: Edit Budget Item
router.post('/:eventId/edit/:budgetId', redirectLogin, (req, res) => {
  const { eventId, budgetId } = req.params;
  const { allocated_amount, actual_amount } = req.body;

  const query = 'UPDATE budgets SET allocated_amount = ?, actual_amount = ? WHERE budget_id = ? AND event_id = ?';
  db.query(query, [allocated_amount, actual_amount, budgetId, eventId], (err) => {
    if (err) throw err;
    res.redirect(`/budget/${eventId}`);
  });
});

// POST: Delete Budget Item
router.post('/:eventId/delete/:budgetId', redirectLogin, (req, res) => {
  const { eventId, budgetId } = req.params;

  const query = 'DELETE FROM budgets WHERE budget_id = ? AND event_id = ?';
  db.query(query, [budgetId, eventId], (err) => {
    if (err) throw err;
    res.redirect(`/budget/${eventId}`);
  });
});

module.exports = router;