const express = require("express");
const router = express.Router();

// Middleware to protect private routes
const redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }
  next();
};

// Public Home Route
router.get("/", (req, res) => {
  res.render("home");
});

// Landing Page - User's Events
router.get("/landing", redirectLogin, (req, res) => {
  const userId = req.session.user.id;
  const query = "SELECT * FROM events WHERE user_id = ?";
  db.query(query, [userId], (err, events) => {
    if (err) throw err;
    res.render("landing", { events });
  });
});

// Add Event (GET)
router.get("/add-event", redirectLogin, (req, res) => {
  res.render("add-event");
});

// Add Event (POST)
router.post("/add-event", redirectLogin, (req, res) => {
  console.log("SESSION AT /add-event:", req.session);

  const { event_name, event_date, total_budget } = req.body;
  const userId = req.session.user?.id;

  if (!userId) {
    console.log("No user ID found in session");
    return res.status(401).send("You must be logged in to create an event.");
  }

  const query = `
    INSERT INTO events (user_id, event_name, event_date, total_budget)
    VALUES (?, ?, ?, ?)`;
  db.query(query, [userId, event_name, event_date, total_budget || null], (err, result) => {
    if (err) throw err;
    const eventId = result.insertId;
    res.redirect(`/dashboard/${eventId}`);
  });
});

// Edit Event (GET)
router.get("/edit-event/:eventId", redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const query = "SELECT * FROM events WHERE event_id = ?";
  db.query(query, [eventId], (err, result) => {
    if (err) throw err;
    res.render("edit-event", { event: result[0] });
  });
});

// Edit Event (POST)
router.post("/edit-event/:eventId", redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const { event_name, event_date, total_budget } = req.body;
  const query = "UPDATE events SET event_name = ?, event_date = ?, total_budget = ? WHERE event_id = ?";
  db.query(query, [event_name, event_date, total_budget, eventId], (err) => {
    if (err) throw err;
    res.redirect("/landing");
  });
});


// ✅ Redirect /dashboard to /landing
router.get("/dashboard", redirectLogin, (req, res) => {
  res.redirect("/landing");
});

// Dashboard (GET)
router.get("/dashboard/:eventId", redirectLogin, (req, res) => {
  const eventId = req.params.eventId;

  const eventQuery = "SELECT * FROM events WHERE event_id = ?";
  const budgetQuery = "SELECT * FROM budgets WHERE event_id = ?";
  const guestSummaryQuery = `
    SELECT 
      COUNT(*) AS total, 
      SUM(rsvp_status = 'yes') AS confirmed, 
      SUM(rsvp_status = 'no') AS declined, 
      SUM(rsvp_status = 'maybe') AS maybe 
    FROM guests 
    WHERE event_id = ?
  `;
  const tasksQuery = "SELECT * FROM tasks WHERE event_id = ? ORDER BY due_date ASC";
  const milestonesQuery = "SELECT * FROM milestones WHERE event_id = ? ORDER BY due_date ASC";

  db.query(eventQuery, [eventId], (err, eventResult) => {
    if (err) throw err;
    if (eventResult.length === 0) {
      // Event doesn't exist or deleted 
      return res.redirect("/landing");
    }
  
    const event = eventResult[0];

    const currentMonth = req.query.month
      ? parseInt(req.query.month)
      : event.event_date.getMonth();
    const currentYear = req.query.year
      ? parseInt(req.query.year)
      : event.event_date.getFullYear();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    db.query(budgetQuery, [eventId], (err, budgetResults) => {
      if (err) throw err;
      const totalSpent = budgetResults.reduce(
        (acc, curr) => acc + parseFloat(curr.allocated_amount),
        0
      );

      db.query(guestSummaryQuery, [eventId], (err, guestSummaryResult) => {
        if (err) throw err;
        const guestSummary = guestSummaryResult[0];

        db.query(tasksQuery, [eventId], (err, taskResults) => {
          if (err) throw err;

          db.query(milestonesQuery, [eventId], (err, milestoneResults) => {
            if (err) throw err;

            res.render("dashboard", {
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
              guestSummary,
              tasks: taskResults,
              milestones: milestoneResults,
            });
          });
        });
      });
    });
  });
});

// Add Budget Item
router.post("/dashboard/:eventId/add-budget", redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const { category_name, allocated_amount } = req.body;

  const query = "INSERT INTO budgets (event_id, category_name, allocated_amount) VALUES (?, ?, ?)";
  db.query(query, [eventId, category_name, allocated_amount], (err) => {
    if (err) throw err;
    res.redirect(`/dashboard/${eventId}`);
  });
});

router.post("/delete-event/:eventId", redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const query = "DELETE FROM events WHERE event_id = ?";

  db.query(query, [eventId], (err) => {
    if (err) throw err;
    res.redirect("/landing");
  });
});

module.exports = router;