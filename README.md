# Team Task Manager

A full-stack web application built for managing projects and tracking tasks across teams with role-based access control. 

## Features
- **Authentication**: Secure Signup and Login using JWT.
- **Role-Based Access**: Distinguishes between Admin and Member roles (e.g., Admins can create projects, Members can view/manage tasks).
- **Projects & Tasks**: Complete Kanban-style task tracking (To Do, In Progress, Done, Overdue) tied to specific projects.
- **Dashboard**: High-level overview of assigned tasks and status metrics.

## Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic
- **Frontend**: React, Vite, React Router, Custom CSS Variables (Premium UI)
- **Database**: PostgreSQL (Production) / SQLite (Local)

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VoonaSriraj/Team-Task-Manager.git
   cd Team-Task-Manager
   ```

2. **Backend Setup:**
   ```bash
   python -m venv backend/venv
   source backend/venv/Scripts/activate # On Windows use `backend\venv\Scripts\activate`
   pip install -r backend/requirements.txt
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

4. **Run the App:**
   From the project root:
   ```bash
   uvicorn backend.main:app --reload
   ```
   The app will be available at `http://localhost:8000`.

## Deployment (Railway)
This application is configured for a unified deployment on Railway. 
- A custom `Dockerfile` is included that builds the frontend and serves it directly through FastAPI.
- Simply link your GitHub repo to Railway, add a PostgreSQL database, and Railway will handle the rest!
