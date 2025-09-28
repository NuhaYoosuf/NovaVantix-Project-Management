# 🚀 NovaVantix Project Management System

> **Full-Stack Internship Project by Nuha Yoosuf**  
> A comprehensive project management system built with React, TypeScript, FastAPI, and MySQL


## 🎯 Overview

NovaVantix is a modern, full-stack project management system that enables teams to efficiently manage projects and tasks. The application features role-based access control, real-time task management, and a beautiful, responsive user interface.

### ✨ Key Highlights
- **Professional UI/UX**: Purple gradient theme with intuitive design
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Role-Based Access**: Admin and Member roles with appropriate permissions
- **Real-time Updates**: Optimistic locking for concurrent task editing
- **Search & Filtering**: Advanced project and task filtering capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🌟 Features

### 👑 Admin Features
- ✅ Create and manage projects
- ✅ Assign tasks to team members
- ✅ View all projects and tasks across the organization
- ✅ Manage user roles and permissions
- ✅ Access comprehensive dashboard analytics

### 👥 Member Features
- ✅ View assigned projects
- ✅ Create and edit tasks within assigned projects
- ✅ Update task status (Todo → In Progress → Done)
- ✅ Search and filter tasks by status and assignee
- ✅ Real-time task collaboration with optimistic locking

### 🎨 UI/UX Features
- ✅ Modern purple gradient theme
- ✅ Color-coded task status badges
- ✅ Responsive navigation with company branding
- ✅ Clean, intuitive forms and layouts
- ✅ Loading states and error handling
- ✅ Professional typography and spacing

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with gradients and animations

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Database ORM
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Pydantic** - Data validation

### Database
- **MySQL** - Relational database
- **PyMySQL** - MySQL connector for Python

### Development Tools
- **ESLint** - Code linting
- **python-dotenv** - Environment variable management
- **Uvicorn** - ASGI web server

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.10+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **MySQL 8.0+** - [Download MySQL](https://dev.mysql.com/downloads/)
- **Git** - [Download Git](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/NuhaYoosuf/NovaVantix-Project-Management.git
cd NovaVantix-Project-Management
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
```

#### Database Configuration
1. **Install MySQL** and create a database:
```sql
CREATE DATABASE novavantix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Configure Environment Variables**
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/novavantix
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

3. **Seed the Database**
```bash
python seed.py
```

#### Start Backend Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## 🔐 Default Login Credentials

After seeding the database, use these credentials to access the system:

### Admin Account
- **Email**: `admin@demo.test`
- **Password**: `Passw0rd!`
- **Role**: Administrator (full access)

### Member Accounts
- **Email**: `alice@demo.test`
- **Password**: `password123`
- **Role**: Member

- **Email**: `bob@demo.test`
- **Password**: `password123`
- **Role**: Member

## 📖 Usage

### Getting Started
1. **Login**: Navigate to `http://localhost:5173` and login with admin credentials
2. **Create Project**: Use the admin account to create your first project
3. **Add Tasks**: Create tasks and assign them to team members
4. **Manage Tasks**: Team members can update task statuses and collaborate

### Key Workflows

#### For Administrators
1. **Project Creation**: Click "Create New Project" → Fill project details → Save
2. **Task Assignment**: Navigate to project → "Create New Task" → Assign to member
3. **Team Overview**: View all projects and tasks across the organization

#### For Members
1. **View Tasks**: See assigned tasks in project detail view
2. **Update Status**: Click task → Change status (Todo/In Progress/Done)
3. **Task Creation**: Create new tasks within assigned projects


## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
    assignee_user_id INT,
    due_date DATE,
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assignee_user_id) REFERENCES users(id)
);
```

## 🔒 Authentication

### JWT Token Authentication
- **Algorithm**: HS256
- **Expiration**: 30 minutes
- **Header**: `Authorization: Bearer <token>`

### Password Security
- **Hashing**: bcrypt with salt rounds
- **Requirements**: Strong passwords with mixed case, numbers, and symbols

### Role-Based Access Control (RBAC)
- **Admin**: Full access to all projects and tasks
- **Member**: Access to assigned projects and own tasks

## 📁 Project Structure

```
NovaVantix-Project-Management/
├── backend/                    # FastAPI Backend
│   ├── main.py                # Main application entry point
│   ├── auth.py                # Authentication logic
│   ├── database.py            # Database connection
│   ├── models.py              # SQLAlchemy models
│   ├── seed.py                # Database seeding script
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Login.tsx      # Login component
│   │   │   ├── Projects.tsx   # Projects list
│   │   │   ├── ProjectDetail.tsx
│   │   │   ├── CreateProject.tsx
│   │   │   └── CreateTask.tsx
│   │   ├── App.tsx            # Main app component
│   │   ├── api.tsx            # API client
│   │   ├── types.ts           # TypeScript types
│   │   ├── App.css            # Main styles
│   │   └── main.tsx           # React entry point
│   ├── package.json           # Node dependencies
│   └── vite.config.ts         # Vite configuration
└── README.md                  # This file
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest test_tasks.py -v
```

### Manual Testing Checklist
- [ ] User authentication (login/logout)
- [ ] Project creation and management
- [ ] Task creation and status updates
- [ ] Role-based access control
- [ ] Search and filtering functionality
- [ ] Optimistic locking (edit same task from two browsers)
- [ ] Responsive design on different screen sizes

## 📱 Screenshots

### Login Page
Clean, professional login interface with company branding and purple gradient theme.

### Dashboard
Modern project overview with search functionality and intuitive navigation.

### Project Detail
Comprehensive task management with status badges, filtering, and real-time updates.

### Task Creation
User-friendly forms with proper validation and error handling.




## 🤝 Contributing

This is an internship project for NovaVantix. For any improvements or bug fixes:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📄 License

This project is created as an internship submission for NovaVantix and is intended for educational and evaluation purposes.

## 👨‍💻 Developer

**Nuha Yoosuf**  
Full-Stack Development Intern  
NovaVantix  
📧 Contact: [ahunfathi000@gmail.com]

