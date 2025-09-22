# 📘 Study Planner

A simple and interactive web-based study planner that helps students manage and track their academic tasks effectively. Users can add, edit, delete, and mark tasks as complete, with all data saved locally in the browser for persistence.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Development Approach](#system-development-approach)
- [Algorithm](#algorithm)
- [Deployment](#deployment)
- [Future Scope](#future-scope)
- [How to Use](#how-to-use)
- [License](#license)

---

## Features
- Add new study tasks.
- Edit existing tasks.
- Delete tasks.
- Mark tasks as Complete/Undo with visual strikethrough.
- Tasks persist across browser sessions using LocalStorage.
- Responsive and mobile-friendly design.

---

## Technologies Used
- **HTML5** – Structure of the webpage.
- **CSS3** – Styling and responsive layouts.
- **JavaScript** – Task CRUD operations and interactivity.
- **LocalStorage** – Persistent storage for tasks.

---

## System Development Approach
- **Frontend Design:** Clean and minimal interface using HTML & CSS.
- **Interactive Features:** Add, Edit, Delete, and Complete tasks with JavaScript.
- **Design Principles:** Mobile-responsive, user-friendly, and modular separation of files.

---

## Algorithm
**Task Management**
- Add Task – User inputs task → saved to LocalStorage → displayed in list.
- Edit Task – User modifies task → updates LocalStorage → re-render list.
- Delete Task – User deletes task → updates LocalStorage → re-render list.
- Complete Task – User toggles Complete/Undo → updates LocalStorage → updates styling.
- Render Tasks – Fetch tasks from LocalStorage → display dynamically with buttons.

---

## Deployment
- **Code Structure:** Separate HTML, CSS, and JS files.
- **Testing:** Cross-browser compatibility and mobile responsiveness.
- **Hosting:** Deploy using GitHub Pages or Netlify for free access.

---

## Future Scope
- Add backend integration (Node.js / Firebase) for online storage.
- Enable user authentication for personalized task management.
- Push notifications and reminders for pending tasks.
- Analytics dashboard to track study progress and productivity trends.

---

## How to Use
1. Clone or download the repository.
2. Open `index.html` in your browser.
3. Add, edit, delete, and mark tasks as complete.
4. Your tasks will be saved automatically and persist on reload.

---

## License
This project is open-source and free to use.
