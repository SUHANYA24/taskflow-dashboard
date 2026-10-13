# TaskFlow - Project Management Dashboard

TaskFlow is a practical project-management web application built with React, TypeScript and Supabase.

The project was developed to apply modern frontend and full-stack development concepts in a real working application, including authentication, database integration, CRUD operations, responsive design and deployment.

## Features

- Responsive dashboard
- User registration and login
- Protected routes
- User profile settings
- Dynamic profile initials
- Create, edit and delete projects
- Create, edit and delete tasks
- Task search and filtering
- Drag-and-drop Kanban board
- Task status management
- Project progress overview
- Supabase database integration
- Supabase authentication
- Row Level Security (RLS)
- Light and dark mode
- React Router navigation
- Reusable React components
- Responsive mobile navigation
- 404 page
- Persistent cloud data
- Deployed with Vercel

## Tech Stack

- React
- TypeScript
- Vite
- Supabase
- PostgreSQL
- React Router
- Lucide React
- CSS3
- Git
- GitHub
- Vercel

## Project Purpose

The purpose of TaskFlow was to build a complete working project-management application while applying practical web-development concepts.

The project covers the full development process from frontend UI implementation to authentication, database integration, security, version control and cloud deployment.

## Main Functionality

### Authentication

Users can create an account, sign in and sign out using Supabase Authentication.

Protected routes prevent unauthenticated users from accessing the main application.

### Project Management

Users can:

- Create projects
- Edit project information
- Delete projects
- Set project deadlines
- View project progress

### Task Management

Users can:

- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to projects
- Set task priority
- Set task status
- Set due dates
- Search tasks
- Filter tasks by status

### Kanban Board

Tasks can be moved between:

- To Do
- In Progress
- Done

The Kanban board supports drag-and-drop interaction, and status changes are saved to Supabase.

### Profile Settings

Users can update their full name through the Settings page.

The profile information is stored in Supabase and used to dynamically generate the user's avatar initials.

### Security

Supabase Row Level Security policies are used to ensure users can only access and modify their own:

- Projects
- Tasks
- Profile information

## Run Locally

Clone the repository:

```bash
git clone https://github.com/SUHANYA24/taskflow-dashboard.git

## Live Demo

[View TaskFlow Live](https://taskflow-dashboard-liard.vercel.app/)