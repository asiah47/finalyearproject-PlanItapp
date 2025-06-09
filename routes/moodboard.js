const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Middleware to redirect if user not logged in
const redirectLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/users/login');
  next();
};

// Configure multer for file upload to moodboard directory
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

// GET moodboard page and load themes in saved order
router.get('/:eventId', redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.session.user.id;

  const checkEvent = 'SELECT * FROM events WHERE event_id = ? AND user_id = ?';
  db.query(checkEvent, [eventId, userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect('/landing');

    const themeQuery = 'SELECT * FROM themes WHERE event_id = ? ORDER BY order_index ASC';
    db.query(themeQuery, [eventId], (err, themes) => {
      if (err) throw err;
      res.render('moodboard', { eventId, themes });
    });
  });
});

// POST image upload handler for moodboard
router.post('/:eventId/upload', redirectLogin, upload.single('theme_image'), (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.session.user.id;

  if (!req.file) return res.send('No file uploaded.');
  const filename = req.file.filename;

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

// POST reorder of moodboard images
router.post('/reorder/:eventId', redirectLogin, (req, res) => {
  const eventId = req.params.eventId;
  const order = req.body.order;

  const queries = order.map((id, index) => {
    return new Promise((resolve, reject) => {
      const q = 'UPDATE themes SET order_index = ? WHERE theme_id = ? AND event_id = ?';
      db.query(q, [index, id, eventId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  Promise.all(queries)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err));
});

// POST delete image handler
router.post('/:eventId/delete/:themeId', redirectLogin, (req, res) => {
  const { eventId, themeId } = req.params;
  const userId = req.session.user.id;

  const checkQuery = 'SELECT * FROM events WHERE event_id = ? AND user_id = ?';
  db.query(checkQuery, [eventId, userId], (err, results) => {
    if (err) return res.sendStatus(500);
    if (results.length === 0) return res.sendStatus(403);

    const deleteQuery = 'DELETE FROM themes WHERE theme_id = ? AND event_id = ?';
    db.query(deleteQuery, [themeId, eventId], (err) => {
      if (err) return res.sendStatus(500);
      res.sendStatus(200);
    });
  });
});

module.exports = router;
