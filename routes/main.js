const express = require("express");
const router  = express.Router();

const db = global.db;

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
  const sql    = "SELECT * FROM events WHERE user_id = ?";
  db.query(sql, [userId], (err, events) => {
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
  const { event_name, event_date, venue, address, maxGuests, total_budget } = req.body;
  const userId = req.session.user.id;

  const sql = `
    INSERT INTO events
      (user_id, event_name, event_date, venue, address, maxGuests, total_budget)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [userId, event_name, event_date, venue, address, maxGuests, total_budget || null],
    (err, result) => {
      if (err) throw err;
      res.redirect(`/dashboard/${result.insertId}`);
    }
  );
});

// Edit Event (GET)
router.get("/edit-event/:eventId", redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const sql     = "SELECT * FROM events WHERE event_id = ?";
  db.query(sql, [eventId], (err, rows) => {
    if (err) throw err;
    if (!rows.length) return res.redirect("/landing");
    res.render("edit-event", { event: rows[0] });
  });
});

// Edit Event (POST)
router.post("/edit-event/:eventId", redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const { event_name, event_date, venue, address, maxGuests, total_budget } = req.body;

  const sql = `
    UPDATE events
       SET event_name   = ?,
           event_date   = ?,
           venue        = ?,
           address      = ?,
           maxGuests    = ?,
           total_budget = ?
     WHERE event_id    = ?`;
  db.query(
    sql,
    [event_name, event_date, venue, address, maxGuests, total_budget || null, eventId],
    (err) => {
      if (err) throw err;
      res.redirect("/landing");
    }
  );
});

// Redirect /dashboard to /landing
router.get("/dashboard", redirectLogin, (req, res) => {
  res.redirect("/landing");
});

// Dashboard (GET)
router.get("/dashboard/:eventId", redirectLogin, (req, res) => {
  const eventId = req.params.eventId;

  const eventSql        = "SELECT * FROM events WHERE event_id = ?";
  const budgetSql       = "SELECT * FROM budgets WHERE event_id = ?";
  const guestSummarySql = `
    SELECT
      COUNT(*)                    AS total,
      SUM(rsvp_status = 'yes')    AS confirmed,
      SUM(rsvp_status = 'no')     AS declined,
      SUM(rsvp_status = 'maybe')  AS maybe
    FROM guests
    WHERE event_id = ?`;
  const tasksSql        = "SELECT * FROM tasks WHERE event_id = ? ORDER BY due_date ASC";
  const milestonesSql   = "SELECT * FROM milestones WHERE event_id = ? ORDER BY due_date ASC";

  db.query(eventSql, [eventId], (err, evRows) => {
    if (err) throw err;
    if (!evRows.length) return res.redirect("/landing");
    const event = evRows[0];

    // calendar nav
    const evDate      = new Date(event.event_date);
    const currentMonth = req.query.month ? +req.query.month : evDate.getMonth();
    const currentYear  = req.query.year  ? +req.query.year  : evDate.getFullYear();
    const prevMonth    = currentMonth === 0  ? 11 : currentMonth - 1;
    const prevYear     = currentMonth === 0  ? currentYear - 1 : currentYear;
    const nextMonth    = currentMonth === 11 ? 0  : currentMonth + 1;
    const nextYear     = currentMonth === 11 ? currentYear + 1 : currentYear;

    db.query(budgetSql, [eventId], (err, budgetRows) => {
      if (err) throw err;
      const totalSpent = budgetRows.reduce((sum, b) => sum + parseFloat(b.allocated_amount), 0);

      db.query(guestSummarySql, [eventId], (err, gsRows) => {
        if (err) throw err;
        const guestSummary = gsRows[0];

        db.query(tasksSql, [eventId], (err, taskRows) => {
          if (err) throw err;

          db.query(milestonesSql, [eventId], (err, msRows) => {
            if (err) throw err;

            res.render("dashboard", {
              user:         req.session.user,
              event,
              eventId,
              budgets:      budgetRows,
              totalSpent,
              guestSummary,
              tasks:        taskRows,
              milestones:   msRows,
              eventMonth:   currentMonth,
              eventYear:    currentYear,
              prevMonth,
              prevYear,
              nextMonth,
              nextYear
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
  const sql = "INSERT INTO budgets (event_id, category_name, allocated_amount) VALUES (?, ?, ?)";
  db.query(sql, [eventId, category_name, allocated_amount], (err) => {
    if (err) throw err;
    res.redirect(`/dashboard/${eventId}`);
  });
});

// Delete Event
router.post("/delete-event/:eventId", redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  db.query("DELETE FROM events WHERE event_id = ?", [eventId], (err) => {
    if (err) throw err;
    res.redirect("/landing");
  });
});

module.exports = router;
