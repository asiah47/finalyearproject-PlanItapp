# Create database script for PlanIt_app

# Create the database
CREATE DATABASE IF NOT EXISTS PlanIt_app;
USE PlanIt_app;


# Create the tables
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    priority_level ENUM('green', 'orange', 'red') NOT NULL, 
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending', 
    user_id INT, 
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

# Create the app user
CREATE USER IF NOT EXISTS 'Plan_It_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON PlanIt_app.* TO 'Plan_It_app'@'localhost';
