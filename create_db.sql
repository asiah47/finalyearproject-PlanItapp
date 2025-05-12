# Create database script for PlanIt_app

# Create the database
CREATE DATABASE IF NOT EXISTS PlanIt_app;
USE PlanIt_app;


-- 1. Users Table: Stores user information
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Events Table: Stores event details
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    event_description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 3. Guests Table: Stores guest information for each event
CREATE TABLE guests (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    rsvp_status ENUM('yes', 'no', 'maybe') DEFAULT 'maybe',
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- 4. Countdown Table: Stores countdown data for events
CREATE TABLE countdowns (
    countdown_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    event_datetime DATETIME NOT NULL,    
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- 5. Tasks Table: Stores tasks or checklist items for events
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    due_date DATETIME,
    status ENUM('pending', 'completed', 'in-progress') DEFAULT 'pending',
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- 6. Themes Table: Stores theme-related data for events
CREATE TABLE themes (
    theme_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    theme_name VARCHAR(255) NOT NULL,
    theme_image VARCHAR(255), 
    pinterest_board_url VARCHAR(255), 
    tags TEXT, 
    notes TEXT,
    color_palette TEXT,  
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- Budget Table: Stores the total budget and individual categories with allocated amounts
CREATE TABLE budgets (
    budget_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,               
    total_budget DECIMAL(10, 2) NOT NULL, 
    category_name VARCHAR(255) NOT NULL,  
    allocated_amount DECIMAL(10, 2) NOT NULL,  
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Create the app user
CREATE USER IF NOT EXISTS 'Plan_It_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON PlanIt_app.* TO 'Plan_It_app'@'localhost';
