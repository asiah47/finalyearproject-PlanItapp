const express = require("express");
const router = express.Router();

// Landing Page Route

router.get('/', (req, res) => {
    const userId = 1; 
    const query = 'SELECT * FROM events WHERE user_id = ?';
    db.query(query, [userId], (err, events) => {
        if (err) throw err;
        res.render('landing', { events });
    });
});


// GET AND POST FOR ADD EVENT 
// Add Event Page (GET)
router.get('/add-event', (req, res) => {
    res.render('add-event');
});

// Add Event Handler (POST)
router.post('/add-event', (req, res) => {
    const { event_name, event_date, total_budget} = req.body;
    const userId = 1; 

    const query = 'INSERT INTO events (user_id, event_name, event_date, total_budget) VALUES (?, ?, ?, ?)';
    db.query(query, [userId, event_name, event_date, total_budget], (err, result) => {
        if (err) throw err;
        const eventId = result.insertId;
        res.redirect(`/dashboard/${eventId}`);
    });
});


// Edit Event (GET)
router.get('/edit-event/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const query = 'SELECT * FROM events WHERE event_id = ?';

  db.query(query, [eventId], (err, result) => {
      if (err) throw err;
      res.render('edit-event', { event: result[0] });
  });
});

// Edit Event (POST)
router.post('/edit-event/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const { event_name, event_date, total_budget } = req.body;

  const query = 'UPDATE events SET event_name = ?, event_date = ?, total_budget = ? WHERE event_id = ?';
  db.query(query, [event_name, event_date, total_budget, eventId], (err) => {
      if (err) throw err;
      res.redirect('/');
  });
});


// DASHBOARD
// Dashboard Page (GET)
router.get('/dashboard/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const eventQuery = 'SELECT * FROM events WHERE event_id = ?';  
  const budgetQuery = 'SELECT * FROM budgets WHERE event_id = ?';
  const guestSummaryQuery = `SELECT 
    COUNT(*) AS total, 
    SUM(rsvp_status = 'yes') AS confirmed, 
    SUM(rsvp_status = 'no') AS declined, 
    SUM(rsvp_status = 'maybe') AS maybe 
  FROM guests 
  WHERE event_id = ?`;



  db.query(eventQuery, [eventId], (err, eventResult) => {  
    if (err) throw err;
    const event = eventResult[0];

    // ==== Calendar Logic ====
    const currentMonth = req.query.month ? parseInt(req.query.month) : event.event_date.getMonth();
    const currentYear = req.query.year ? parseInt(req.query.year) : event.event_date.getFullYear();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;


    db.query(budgetQuery, [eventId], (err, budgetResults) => {
      if (err) throw err;

      const totalSpent = budgetResults.reduce((acc, curr) => acc + parseFloat(curr.allocated_amount), 0);

    db.query(guestSummaryQuery, [eventId], (err, guestSummaryResult) => {
      if (err) throw err;
      
      const guestSummary = guestSummaryResult[0];


      res.render('dashboard', {
        event,
        eventId: event.event_id,
        budgets: budgetResults,
        totalSpent,
        eventMonth: currentMonth,
        eventYear: currentYear,
        prevMonth,
        prevYear,
        nextMonth,
        nextYear,
        guestSummary
      });
    });
  });
});

  // Dashboard Page (POST)
  router.post('/dashboard/:eventId/add-budget', (req, res) => {
    const eventId = req.params.eventId;
    const { category_name, allocated_amount } = req.body;
  
    const query = 'INSERT INTO budgets (event_id, category_name, allocated_amount) VALUES (?, ?, ?)';
    db.query(query, [eventId, category_name, allocated_amount], (err, result) => {
      if (err) throw err;
      res.redirect(`/dashboard/${eventId}`);
    });
  });
});
  

module.exports = router;