# PlanIT — Event Planning & Collaboration Web App

**Author:** Asia Hussein  
**Project Type:** Final Year Computer Science Project  
**Technologies:** Node.js, Express, EJS, MySQL, HTML, CSS, JavaScript

---

## Project Overview

PlanIT is a full-stack web application that provides users with a collaborative platform to plan events effectively — combining creativity, organisation, and management tools in one interface. Designed as part of my final year Computer Science project. 

The application supports everything from visual moodboards to budget tracking and guest management, making it suitable for planning personal celebrations, weddings or school events. 
---

## Key Features: 

### Event Management
- Create, edit, and delete events
- Centralised dashboard with all event sections in one place

### Moodboard
- Pinterest-style moodboard
- Drag-and-drop image upload
- Rearranging images for visual organisation

### Budget Tracker
- Add, edit, and delete budget items
- Track actual vs. allocated spending
- Progress bars, category warnings, and budget summaries

### Guest Tracker
- Track number of guests, capacity, and RSVP status
- Add/edit/delete guest entries

###  Task Checklist
- Visual task tracker
- Checklist of incomplete tasks
- Create and update tasks with status

### Calendar & Milestones
- Month-view calendar with navigation
- Countdown to event date

### User Authentication
- Register, login (email + Google), logout
- Session-based route protection
- User-specific dashboards and event data

---

## Technologies Used

### Backend
- Node.js
- Express.js
- Passport.js (for auth)
- MySQL (Relational Database)

### Frontend
- EJS templating engine
- HTML/CSS/JavaScript

### Other
- Multer (image upload)
- Bcrypt (password hashing)
- Nodemailer (optional: for reset password emails)

---

## File Structure

/public
/css → Stylesheets (main.css, dashboard.css, etc.)
/images → Backgrounds, icons, and uploaded images

/views
*.ejs → Page templates for all features (dashboard, moodboard, etc.)

/routes
*.js → All feature and auth routes (auth.js, dashboard.js, budget.js, etc.)

/models
*.js → MySQL queries and logic

app.js → Main server file


---

## How to Run Locally

1. **Clone the repository**
   `bash
   git clone https://github.com/yourusername/planit-app.git
   cd planit-app
   
- Install dependencies
-- npm install
Set up the database
--- Create a MySQL database
Run the provided SQL schema 
Update database credentials in a .env or config file


Run the app
node app.js
Then open http://localhost:8000 in your browser.

-- Security Considerations:
Passwords hashed using bcrypt
SQL injection protection
Sessions used for user state management
Protected routes for user-specific content

-- What I Learned:
Full-stack web development using the Node.js ecosystem
Implementing secure user authentication (including Google OAuth)
Designing for both functionality and UX aesthetics
Managing multi-feature systems with modular architecture
Debugging and integrating third-party tools like Multer and Passport

-- Usability Testing
I conducted informal usability testing with friends and family. Feedback showed:
Users found the interface intuitive and well-organized
The visual elements (moodboard, calendar) were engaging
Suggestions included making the fonts cleaner and adding more modern styling — which were implemented


-- About This Project
This project was submitted as the final-year dissertation for the BSc Computer Science degree. It includes:
A fully working codebase
A technical report with system architecture and testing
A demo video: https://vimeo.com/1086957890/840a782816?ts=0&share=copy  

Developed By:
Asia Hussein
BSc (Hons) Computer Science – Final Year Project
Supervised by Atau Tanaka

