const express = require("express")
const router = express.Router()
const request = require('request');

// Redirect 
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login'); 
    } else {
        next();
    }
};

// Handles the Routes 
// Search
router.get('/search', redirectLogin, function (req, res, next) {
    res.render("search.ejs");
});

router.get('/search_result', redirectLogin, function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM tasks WHERE title LIKE ? AND user_id = ? '%"
     + req.query.search_text + "%'";
    // Execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("listtasks.ejs", { availableTasks: result });
    });
});
// List Tasks
router.get('/listtasks', redirectLogin, function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM tasks WHERE user_id = ?";
     // Execute sql query
    db.query(sqlquery, [req.session.userId], (err, result) => {
        if (err) {
            res.status(500).send("Error fetching tasks.");
        }
        res.render("listtasks.ejs", { availableTasks: result });
    });
});

// Routes to Adding Tasks
router.get('/addtask', redirectLogin, function (req, res, next) {
    res.render('addtask.ejs');
});

router.post('/taskadded', redirectLogin, function (req, res, next) {
    // Saving data in the database
    let sqlquery = "INSERT INTO tasks (title, description, due_date, priority_level, user_id) VALUES (?, ?, ?, ?, ?)";
    let newrecord = [req.body.title, req.body.description, req.body.due_date, req.body.priority_level, req.session.userId];
    // Execute sql query
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            res.status(500).send('Error adding task to database');
        } else {
            res.redirect('/tasks/listtasks');
        }
    });
});

// Route to Upcoming Tasks
router.get('/upcomingtasks', redirectLogin, function (req, res, next) {
    // Search the database
    let sqlquery = `
        SELECT * FROM tasks 
        WHERE due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 10 DAY) 
        AND user_id = ?`;
    // Execute sql query
    db.query(sqlquery, [req.session.userId], (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("upcomingtasks.ejs", { availableTasks: result });
        }
    });
});

// Route to Deleting Tasks
router.post('/delete/:id', redirectLogin, function (req, res, next) {
    const taskId = req.params.id;
    const userId = req.session.userId; 
    // Deleteing data from the database
    let sqlquery = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
    // Execute sql query
    db.query(sqlquery, [taskId, userId], (err, result) => {
        if (err) {
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(403).send("Error: Task not found or permission denied.");
        }
        res.redirect('/tasks/listtasks');
    });
});

// Routes to API
// OpenWeatherAPI
const weatherAPIKey = '1955600fdd4d6f04ee94b67637943c3f'; 
router.get('/weather', (req, res, next) => {
  const city = req.query.city || 'London';  
  const weatherAPI = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAPIKey}`;

 // Request to OpenWeather API
  request(weatherAPI, (err, response, body) => {
    if (err) {
      return next(err);  
    }

    // Parse the response body into JSON
    const weather = JSON.parse(body);

    // If valid weather data found, render to the weather page
    if (weather && weather.main) {
      res.render('weather', {
        city: weather.name,
        temp: weather.main.temp,
        humidity: weather.main.humidity,
        description: weather.weather[0].description,
        windSpeed: weather.wind.speed,
        error: null
      });
    } else {
      // If no valid weather data is found, show error page
      res.render('weather', {
        city: null,
        temp: null,
        humidity: null,
        description: null,
        windSpeed: null,
        error: 'City not found!'
      });
    }
  });
});

// 
// WorldTime API 
router.get('/worldtime', redirectLogin, function (req, res, next) {
    const timezone = req.query.timezone || 'Europe/London'; 
    const apiUrl = `http://worldtimeapi.org/api/timezone/${timezone}`;

    request(apiUrl, function (err, response, body) {
        if (err) {
            return next(err);
        }

        try {
            const timeData = JSON.parse(body);

            if (timeData && timeData.datetime) {
                res.render('worldtime', {
                    timezone: timezone,
                    date: timeData.datetime.split('T')[0], 
                    datetime: timeData.datetime.split('T')[1].split('.')[0], 
                    utcOffset: timeData.utc_offset,
                    error: null
                });
            } else {
                res.render('worldtime', {
                    timezone: null,
                    date: null,
                    datetime: null,
                    utcOffset: null,
                    error: 'Invalid timezone or no data available!'
                });
            }
        } catch (parseError) {
            res.render('worldtime', {
                timezone: null,
                date: null,
                datetime: null,
                utcOffset: null,
                error: 'Error parsing time data!'
            });
        }
    });
});

// Export the router object so index.js can access it
module.exports = router;