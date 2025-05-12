const express = require("express");
const router = express.Router();

// View Guests Page (GET)
router.get('/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const guestsQuery = 'SELECT * FROM guests WHERE event_id = ?';

    db.query(guestsQuery, [eventId], (err, guestResults) => {
        if (err) throw err;
        res.render('guests', { guests: guestResults, eventId });
    });
});

// Add Guest (POST)
router.post('/:eventId/add', (req, res) => {
    const eventId = req.params.eventId;
    const { guest_name, guest_email, rsvp_status } = req.body;
    const query = 'INSERT INTO guests (event_id, guest_name, guest_email, rsvp_status) VALUES (?, ?, ?, ?)';

    db.query(query, [eventId, guest_name, guest_email, rsvp_status], (err) => {
        if (err) throw err;
        res.redirect(`/guests/${eventId}`);
    });
});

// Edit Guest (GET)
router.get('/:eventId/edit/:guestId', (req, res) => {
    const { eventId, guestId } = req.params;
    const query = 'SELECT * FROM guests WHERE guest_id = ?';
    db.query(query, [guestId], (err, result) => {
        if (err) throw err;
        res.render('edit-guest', { guest: result[0], eventId });
    });
});

// Edit Guest (POST)
router.post('/:eventId/edit/:guestId', (req, res) => {
    const { eventId, guestId } = req.params;
    const { guest_name, guest_email, rsvp_status } = req.body;
    const query = 'UPDATE guests SET guest_name = ?, guest_email = ?, rsvp_status = ? WHERE guest_id = ?';

    db.query(query, [guest_name, guest_email, rsvp_status, guestId], (err) => {
        if (err) throw err;
        res.redirect(`/guests/${eventId}`);
    });
});

// Delete Guest (POST)
router.post('/:eventId/delete/:guestId', (req, res) => {
    const { eventId, guestId } = req.params;
    const query = 'DELETE FROM guests WHERE guest_id = ?';

    db.query(query, [guestId], (err) => {
        if (err) throw err;
        res.redirect(`/guests/${eventId}`);
    });
});

module.exports = router;
