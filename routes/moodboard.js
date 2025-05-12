const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

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

// View Moodboard
router.get('/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const query = 'SELECT * FROM themes WHERE event_id = ?';

    db.query(query, [eventId], (err, themes) => {
        if (err) throw err;
        res.render('moodboard', { eventId, themes });
    });
});

// Upload Image (POST)
router.post('/:eventId/upload', upload.single('theme_image'), (req, res) => {
    const eventId = req.params.eventId;
    const filename = req.file.filename;

    const query = 'INSERT INTO themes (event_id, theme_image) VALUES (?, ?)';
    db.query(query, [eventId, filename], (err) => {
        if (err) throw err;
        res.redirect(`/moodboard/${eventId}`);
    });
});

module.exports = router;