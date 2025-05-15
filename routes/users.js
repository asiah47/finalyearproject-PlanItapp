const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  next();
};

// GET: Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// POST: Handle Login
router.post("/loggedin", (req, res, next) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], (err, result) => {
    if (err) return next(err);
    if (result.length === 0) return res.send("Login failed: Username not found.");

    const user = result[0];
    bcrypt.compare(password, user.hashed_password, (err, match) => {
      if (err) return next(err);
      if (!match) return res.send("Login failed: Incorrect password.");

      // Session
      req.session.user = {
        id: user.user_id,
        username: user.username,
        name: user.first_name + " " + user.last_name,
      };
      req.session.userId = user.user_id;
      res.redirect("/landing");
    });
  });
});

// GET: Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

// POST: Handle Registration
router.post("/register", (req, res, next) => {
  const { username, first, last, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.render("register", { error: "Passwords do not match." });
  }

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return next(err);

    const sql = `
      INSERT INTO users (username, first_name, last_name, email, hashed_password)
      VALUES (?, ?, ?, ?, ?)`;
    const values = [username, first, last, email, hashedPassword];

    db.query(sql, values, (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.render("register", { error: "Username already taken." });
        }
        return next(err);
      }

      res.redirect("/users/login");
    });
  });
});

// GET: Profile
router.get("/profile", redirectLogin, (req, res, next) => {
    const userId = req.session.userId;
  
    const query = `
      SELECT first_name, last_name, username, email FROM users WHERE user_id = ?
    `;
  
    db.query(query, [userId], (err, results) => {
      if (err) return next(err);
      const user = results[0];
  
      res.render("profile", {
        user: {
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          email: user.email,
        },
      });
    });
  });

  router.post("/update-profile", redirectLogin, (req, res, next) => {
    const userId = req.session.userId;
    const { first_name, last_name, username, email } = req.body;
  
    const query = `
      UPDATE users SET first_name = ?, last_name = ?, username = ?, email = ? WHERE user_id = ?
    `;
  
    db.query(query, [first_name, last_name, username, email, userId], (err) => {
      if (err) return next(err);
      // Update session name too
      req.session.user.name = `${first_name} ${last_name}`;
      req.session.user.username = username;
      res.redirect("/users/profile");
    });
  });

// POST: Delete Account
router.post("/delete-account", redirectLogin, (req, res, next) => {
  const userId = req.session.userId;
  db.query("DELETE FROM users WHERE user_id = ?", [userId], (err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("/users/login");
    });
  });
});

// GET: Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;