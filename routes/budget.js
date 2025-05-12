const express = require("express");
const router = express.Router();

// Setting the Budget (POST)
router.post('/:eventId/set-total-budget', (req, res) => {
    const eventId = req.params.eventId;
    const { total_budget } = req.body;

    const query = 'UPDATE events SET total_budget = ? WHERE event_id = ?';
    db.query(query, [total_budget, eventId], (err) => {
        if (err) throw err;
        res.redirect(`/budget/${eventId}`);
    });
});

// Add Budget Tracker (GET)
router.get('/:eventId', (req, res) => {
    const eventId = req.params.eventId;

    const eventQuery = 'SELECT * FROM events WHERE event_id = ?';
    const budgetQuery = 'SELECT * FROM budgets WHERE event_id = ?';

    db.query(eventQuery, [eventId], (err, eventResult) => {
        if (err) throw err;
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

// Add Budget Item (POST)
router.post('/:eventId/add', (req, res) => {
    const eventId = req.params.eventId;
    const { category_name, allocated_amount } = req.body;

    const query = 'INSERT INTO budgets (event_id, category_name, allocated_amount) VALUES (?, ?, ?)';
    db.query(query, [eventId, category_name, allocated_amount], (err) => {
        if (err) throw err;
        res.redirect(`/budget/${eventId}`);
    });
});


// Edit Budget Item (GET)
router.get('/:eventId/edit/:budgetId', (req, res) => {
    const { eventId, budgetId } = req.params;
    const query = 'SELECT * FROM budgets WHERE budget_id = ?';
    db.query(query, [budgetId], (err, result) => {
        if (err) throw err;
        res.render('edit-budget', { budget: result[0], eventId });
    });
});


// Edit Budget Item (POST)
router.post('/:eventId/edit/:budgetId', (req, res) => {
    const { eventId, budgetId } = req.params;
    const { allocated_amount, actual_amount } = req.body;

    const query = 'UPDATE budgets SET allocated_amount = ?, actual_amount = ? WHERE budget_id = ?';
    db.query(query, [allocated_amount, actual_amount, budgetId], (err) => {
        if (err) throw err;
        res.redirect(`/budget/${eventId}`);
    });
});

// Delete Budget item 
router.post('/:eventId/delete/:budgetId', (req, res) => {
    const { eventId, budgetId } = req.params;
    const query = 'DELETE FROM budgets WHERE budget_id = ?';
    db.query(query, [budgetId], (err) => {
        if (err) throw err;
        res.redirect(`/budget/${eventId}`);
    });
});

module.exports = router;
