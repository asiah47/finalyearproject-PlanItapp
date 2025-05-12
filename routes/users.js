// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login'); 
    } else {
        next();
    }
};

// Login Route
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/loggedin', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            return next(err);
        }
        if (result.length === 0) {
            return res.send("Login failed: Username is not recognised.");
        }
        const user = result[0];
        const hashedPassword = user.hashed_password;
        bcrypt.compare(password, hashedPassword, function (err, result) {
            if (err) {
                return next(err);
            } else if (result === true) {

                req.session.user = {
                    id: user.id,
                    username: user.username
                  };

                res.render('loginsuccessful', { user: user });
            } else {
                return res.send("Login Failed: Incorrect Password");
            }
        });
    });
});



// Register and Registered Routes
router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        // Saving data to the database 
        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)";
        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];
        
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
            let resultMessage = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered!';
            resultMessage += ' Your hashed password is: ' + hashedPassword;
            res.send(resultMessage);
        });
    });
});


// Routes for the Profile Page
router.get('/profile',redirectLogin, (req, res, next) => {
    const userId = req.session.userId; 
    
    // Query to fetch user's details
    const query = 'SELECT first_name, last_name, email FROM users WHERE id = ?';
    
    db.query(query, [userId], (err, results) => {
      if (err) {
        return next(err);
      }
  
      const user = results[0]; 
      res.render('profile', {
        firstName: user.first_name || 'No name provided',
        lastName: user.last_name,
        email: user.email,
      });
    });
});
  
// Rout for Deleting Account
router.post('/delete-account', redirectLogin, (req, res, next) => {
    const userId = req.session.userId;  

    // Query to delete user and their tasks from the database
    const deleteQuery = 'DELETE FROM users WHERE id = ?';

    db.query(deleteQuery, [userId], (err, results) => {
        if (err) {
            return next(err);
        }

        // Destroy the session after account deletion
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }

            res.redirect('/users/login'); 
        });
    });
});

// Export the router object so index.js can access it
module.exports = router;
