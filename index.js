// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
var session = require ('express-session')

// Create the express application object
const app = express()
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and static js)
app.use(express.static(__dirname + '/public'))

// Define database connection 
const mysql = require('mysql2');

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
            expires: 600000
        }
}))


// Load the route handlers for /main
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /tasks
const tasksRoutes = require('./routes/tasks')
app.use('/tasks', tasksRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))