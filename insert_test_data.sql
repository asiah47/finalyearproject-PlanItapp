-- Insert test data for PlanIt_app

-- Budgets
INSERT INTO budgets (budget_id, event_id, category_name, allocated_amount, created_at, actual_amount) VALUES 
(3, 1, 'VENUE', 500.00, '2025-04-26 22:33:59', 100.00),
(4, 1, 'DECOR', 500.00, '2025-04-26 23:27:30', NULL),
(5, 2, 'Venue', 100.00, '2025-05-13 12:56:15', NULL),
(7, 7, 'Outfit', 100.00, '2025-05-15 09:20:06', NULL),
(8, 7, 'Venue', 0.00, '2025-05-15 09:20:17', NULL),
(9, 7, 'Food and Drinks', 100.00, '2025-05-15 09:20:32', NULL),
(10, 7, 'Transport', 50.00, '2025-05-15 09:20:56', NULL),
(12, 7, 'Emergency', 50.00, '2025-05-15 09:21:38', NULL);

-- Events
INSERT INTO events (event_id, user_id, event_name, event_date, event_description, total_budget) VALUES 
(1, 1, 'Fiona''s Grand Wedding', '2025-08-02 05:00:00', NULL, 5000.00),
(2, 1, 'A''S Birthday', '2025-05-22 20:10:00', NULL, 110.00),
(7, 4, 'Birthday Outing', '2025-07-23 00:00:00', NULL, 200.00);

-- Guests
INSERT INTO guests (guest_id, event_id, guest_name, guest_email, rsvp_status) VALUES 
(2, 1, 'hamdi h', 'h@gmail.com', 'yes'),
(4, 2, 'Drew', 'drewaddams@gmail.com', 'yes'),
(8, 7, 'Steph', 'sg@gmail.com', 'yes'),
(9, 7, 'Frankie', 'f@gmail.com', 'no'),
(10, 7, 'Steve', 'ss@gmail.com', 'yes'),
(11, 7, 'Derek', 'd@gmail.com', 'maybe'),
(12, 7, 'Pep', 'p@gmail.com', 'yes'),
(13, 7, 'Sara', 's@gmail.com', 'maybe'),
(14, 7, 'Grace', 'GG@gmail.com', 'yes');

-- Tasks
INSERT INTO tasks (task_id, event_id, task_name, task_description, due_date, status) VALUES 
(7, 7, 'Venue', 'Choose a Venue', '2025-05-17 09:18:00', 'completed'),
(8, 7, 'Food and Drinks', '--', '2025-05-30 00:00:00', 'pending'),
(9, 7, 'Outfit', 'Go Shopping for an Outfit', '2025-05-29 09:19:00', 'pending');

-- Themes
INSERT INTO themes (theme_id, event_id, theme_name, theme_image, pinterest_board_url, tags, notes, color_palette) VALUES 
(1, 1, '', '1745752218052-05b4e036a98aeab9271279664e4ad416.jpg', NULL, NULL, NULL, NULL),
(2, 1, '', '1745752246303-pink-theme-flower-wedding-cakes.jpg', NULL, NULL, NULL, NULL),
(3, 1, '', '1745752250712-Copy-of-JLW-_-Collage-or-Mood-Board-569x1024.jpg', NULL, NULL, NULL, NULL),
(4, 1, '', '1745752264330-12-2.jpg', NULL, NULL, NULL, NULL),
(5, 1, '', '1745752268033-6a87e6ffd85dd13724c9626d3cc52b94.jpg', NULL, NULL, NULL, NULL),
(6, 1, '', '1745753186646-241efeb4eaf0383b51a7544a986a2841.jpg', NULL, NULL, NULL, NULL),
(7, 7, 'Untitled', '1747300430311-sage-green-aesthetic-pictures-r0zgg2k32b5wmpwq.jpg', NULL, NULL, NULL, NULL),
(8, 7, 'Untitled', '1747300433936-1029046.png', NULL, NULL, NULL, NULL),
(9, 7, 'Untitled', '1747300437952-flowy-olive-green-maxi-dress-folklore-Taylor-Swift-Eras-tour-outfits-and-ideas-1.jpeg.webp', NULL, NULL, NULL, NULL),
(10, 7, 'Untitled', '1747300440329-how-to-throw-a-safari-themed-party-194370.jpg.webp', NULL, NULL, NULL, NULL),
(11, 7, 'Untitled', '1747300450257-e5e009f4adf1650011bcb2d52b86430d.jpg', NULL, NULL, NULL, NULL),
(12, 7, 'Untitled', '1747300458494-60769fc7-0e40-4bad-9ff2-1ba991e6eea3.jpg.webp', NULL, NULL, NULL, NULL);

-- Users
INSERT INTO users (user_id, first_name, last_name, username, email, hashed_password, created_at) VALUES 
(1, 'A', 'H', 'ah', 'ah@gmail.com', '$2b$10$hfcZHrV1t.E1YGWWugY7le80Cl.lTfS34vpHFsT/kOwsDPVOFlpHK', '2025-03-11 13:48:44'),
(3, 'Dave', 'D', 'D', 'D@gmail.com', '$2b$10$MvmsJ9oIJ9kFGOStH2ecsOFOqIBmNxTCKZHOzbHe4veFCNuUkvcYy', '2025-05-13 14:12:44'),
(4, 'Derek', 'D', 'DaveD', 'd1@gmail.com', '$2b$10$LFaYsSe0Q34s.c1rBPjIOOSKeTHDj8YDT3E1ogh70cvd5hejUTfHy', '2025-05-13 14:24:42');