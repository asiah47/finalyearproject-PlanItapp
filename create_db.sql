-- Create database
CREATE DATABASE IF NOT EXISTS PlanIt_app;
USE PlanIt_app;

-- Users Table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
DROP TABLE IF EXISTS events;
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    event_description TEXT,
    total_budget DECIMAL(10,2) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Guests Table
DROP TABLE IF EXISTS guests;
CREATE TABLE guests (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    rsvp_status ENUM('yes', 'no', 'maybe') DEFAULT 'maybe',
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Countdowns Table
DROP TABLE IF EXISTS countdowns;
CREATE TABLE countdowns (
    countdown_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    event_datetime DATETIME NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- Tasks Table
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    due_date DATETIME DEFAULT NULL,
    status ENUM('pending','completed','in-progress') DEFAULT 'pending',
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Themes Table
DROP TABLE IF EXISTS themes;
CREATE TABLE themes (
    theme_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    theme_name VARCHAR(255) DEFAULT 'Untitled',
    theme_image VARCHAR(255),
    pinterest_board_url VARCHAR(255),
    tags TEXT,
    notes TEXT,
    color_palette TEXT,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- Budgets Table
DROP TABLE IF EXISTS budgets;
CREATE TABLE budgets (
    budget_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    allocated_amount DECIMAL(10,2) NOT NULL,
    actual_amount DECIMAL(10,2) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Contact Submissions Table
DROP TABLE IF EXISTS contact_submissions;
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Milestones Table
DROP TABLE IF EXISTS milestones;
CREATE TABLE milestones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT DEFAULT NULL,
    title VARCHAR(255),
    due_date DATE,
    completed TINYINT(1) DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Moodboard Table 
    CREATE TABLE moodboard_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  theme_image VARCHAR(255) NOT NULL,
  order_index INT DEFAULT 0,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE

);