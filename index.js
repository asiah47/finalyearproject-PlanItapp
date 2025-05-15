// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
var session = require ('express-session')
const mysql = require('mysql2');
const path = require('path');


// Create the express application object
const app = express()
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and static js)
app.use(express.static(__dirname + '/public'))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'Plan_It_app',
    password: 'qwertyuiop',
    database: 'PlanIt_app'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
    console.log('Connected to PlanIT_app database');
});

global.db = db;

// Define our application-specific data
app.locals.shopData = {shopName: "PlanIT"}

// Create a session
app.use(session({
        secret: 'somerandomstuff',
        resave: false,
        saveUninitialized: false,
        cookie: {
           maxAge: 10 * 60 * 1000
        }
}))

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; 
    next();
});

// Routes
const usersRoutes = require("./routes/users");
const mainRoutes = require("./routes/main");
const budgetRoutes = require('./routes/budget');
const guestRoutes = require('./routes/guests');
const tasksRoutes = require('./routes/tasks');
const moodboardRoutes = require('./routes/moodboard');

app.use('/users', usersRoutes);
app.use('/', mainRoutes);
app.use('/budget', budgetRoutes);
app.use('/guests', guestRoutes);
app.use('/tasks', tasksRoutes);
app.use('/moodboard', moodboardRoutes);
app.use('/uploads', express.static('uploads'));


// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))