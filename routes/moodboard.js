const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Session check middleware
const redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  next();
};

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/moodboard/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// View Moodboard (GET)
router.get('/:eventId', redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.session.user.id;

  // Ensure the event belongs to this user
  const checkEvent = 'SELECT * FROM events WHERE event_id = ? AND user_id = ?';
  db.query(checkEvent, [eventId, userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect('/landing'); // Not allowed

    const themeQuery = 'SELECT * FROM themes WHERE event_id = ?';
    db.query(themeQuery, [eventId], (err, themes) => {
      if (err) throw err;
      res.render('moodboard', { eventId, themes });
    });
  });
});

// Upload Image (POST)
router.post('/:eventId/upload', redirectLogin, upload.single('theme_image'), (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.session.user.id;

  if (!req.file) {
    return res.send('No file uploaded.');
  }

  const filename = req.file.filename;

  // Check that the event belongs to the current user before edits made 
  const checkEvent = 'SELECT * FROM events WHERE event_id = ? AND user_id = ?';
  db.query(checkEvent, [eventId, userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect('/landing');

    const insertQuery = 'INSERT INTO themes (event_id, theme_image) VALUES (?, ?)';
    db.query(insertQuery, [eventId, filename], (err) => {
      if (err) throw err;
      res.redirect(`/moodboard/${eventId}`);
    });
  });
});

module.exports = router;