const express = require("express");
const router = express.Router();

// Middleware for login protection
const redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  next();
};

// View Guests Page (GET)
router.get('/:eventId', redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.session.user.id;

  const query = `
    SELECT * FROM guests 
    WHERE event_id = ? AND event_id IN 
      (SELECT event_id FROM events WHERE user_id = ?)
  `;

  db.query(query, [eventId, userId], (err, guestResults) => {
    if (err) throw err;
    res.render('guests', { guests: guestResults, eventId });
  });
});

// Add Guest (POST)
router.post('/:eventId/add', redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const { guest_name, guest_email, rsvp_status } = req.body;

  const query = `
    INSERT INTO guests (event_id, guest_name, guest_email, rsvp_status) 
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [eventId, guest_name, guest_email, rsvp_status], (err) => {
    if (err) throw err;
    res.redirect(`/guests/${eventId}`);
  });
});

// Edit Guest (GET)
router.get('/:eventId/edit/:guestId', redirectLogin, (req, res) => {
  const { eventId, guestId } = req.params;
  const userId = req.session.user.id;

  const query = `
    SELECT * FROM guests 
    WHERE guest_id = ? AND event_id = ? 
      AND event_id IN (SELECT event_id FROM events WHERE user_id = ?)
  `;
  db.query(query, [guestId, eventId, userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect(`/guests/${eventId}`);
    res.render('edit-guest', { guest: result[0], eventId });
  });
});

// Edit Guest (POST)
router.post('/:eventId/edit/:guestId', redirectLogin, (req, res) => {
  const { eventId, guestId } = req.params;
  const { guest_name, guest_email, rsvp_status } = req.body;

  const query = `
    UPDATE guests 
    SET guest_name = ?, guest_email = ?, rsvp_status = ? 
    WHERE guest_id = ? AND event_id = ?
  `;
  db.query(query, [guest_name, guest_email, rsvp_status, guestId, eventId], (err) => {
    if (err) throw err;
    res.redirect(`/guests/${eventId}`);
  });
});

// Delete Guest (POST)
router.post('/:eventId/delete/:guestId', redirectLogin, (req, res) => {
  const { eventId, guestId } = req.params;

  const query = 'DELETE FROM guests WHERE guest_id = ? AND event_id = ?';
  db.query(query, [guestId, eventId], (err) => {
    if (err) throw err;
    res.redirect(`/guests/${eventId}`);
  });
});

module.exports = router;