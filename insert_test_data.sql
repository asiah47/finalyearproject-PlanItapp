# Insert data into the tables

USE PlanIt_app;

INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES
('jdoe', 'Jane', 'Doe', 'jdoe@gmail.com', 'hashed_password_123'),
('ssmith', 'Sam', 'Smith', 'ssmith@gmail.com', 'hashed_password_456'),
('ebrit', 'Edie', 'Brit', 'ebrit@gmail.com', 'hashed_password_789');


INSERT INTO tasks (title, description, due_date, priority_level, status, user_id) VALUES
('Complete Project Report', 'Finish the project report for review.', '2024-12-01', 'red', 'completed', 1),
('Buy Groceries', 'Buy vegetables and milk for the week.', '2024-12-20', 'orange', 'in_progress', 2),
('Exercise', 'Evening workout routine.', '2024-12-10', 'green', 'completed', 3);

