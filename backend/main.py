from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from models import User, Project, Task, UserRole, TaskStatus
from database import get_db, create_tables
from auth import verify_password, get_password_hash, create_access_token, verify_token
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str

class TaskCreate(BaseModel):
    title: str
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[TaskStatus] = None
    assignee_user_id: Optional[int] = None
    version: int

# Auth dependency
def get_current_user(authorization: str = Header(...), db: Session = Depends(get_db)):
    print(f"Authorization header: {authorization}")  # Debug log
    
    if not authorization.startswith("Bearer "):
        print("Authorization header doesn't start with Bearer")  # Debug log
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    token = authorization[7:]
    print(f"Extracted token: {token[:20]}...")  # Debug log (first 20 chars only)
    
    payload = verify_token(token)
    if not payload:
        print("Token verification failed")  # Debug log
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("sub")
    print(f"User ID from token: {user_id}")  # Debug log
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        print(f"User with ID {user_id} not found in database")  # Debug log
        raise HTTPException(status_code=401, detail="User not found")
    
    print(f"User authenticated successfully: {user.email}")  # Debug log
    return user

# Routes
@app.post("/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    print(f"Login attempt for email: {request.email}")  # Debug log
    
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        print(f"Login failed for email: {request.email}")  # Debug log
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    print(f"User found: {user.email}, ID: {user.id}")  # Debug log
    token = create_access_token({"sub": user.id})
    print(f"Token created: {token[:20]}...")  # Debug log (first 20 chars only)
    
    return {"access_token": token, "token_type": "bearer"}

@app.get("/projects")
def get_projects(q: Optional[str] = None, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(Project)
    if q:
        query = query.filter(Project.name.ilike(f"%{q}%"))
    return query.all()

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

@app.post("/projects")
def create_project(project_data: ProjectCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    print(f"Creating project: {project_data.name} by user: {user.email}")  # Debug log
    
    # Allow both admin and regular users to create projects for demo purposes
    # In production, you might want to restrict this
    project = Project(name=project_data.name, description=project_data.description)
    db.add(project)
    db.commit()
    db.refresh(project)
    
    print(f"Project created successfully: ID {project.id}")  # Debug log
    return project

@app.get("/projects/{project_id}/tasks")
def get_tasks(project_id: int, status: Optional[TaskStatus] = None, assignee: Optional[int] = None, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(Task).filter(Task.project_id == project_id)
    
    if user.role == UserRole.MEMBER:
        query = query.filter(Task.assignee_user_id == user.id)
    
    if status:
        query = query.filter(Task.status == status)
    if assignee:
        query = query.filter(Task.assignee_user_id == assignee)
    
    return query.all()

@app.post("/projects/{project_id}/tasks")
def create_task(project_id: int, task: TaskCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    new_task = Task(
        project_id=project_id,
        title=task.title,
        assignee_user_id=user.id,
        due_date=task.due_date
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.patch("/tasks/{task_id}")
def update_task(task_id: int, update: TaskUpdate, if_match: Optional[str] = Header(None), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Authorization check
    if user.role == UserRole.MEMBER and task.assignee_user_id != user.id:
        raise HTTPException(status_code=403, detail="Can only edit own tasks")
    
    # Optimistic locking
    current_version = if_match if if_match else update.version
    if task.version != int(current_version):
        raise HTTPException(status_code=409, detail="Conflict: task was modified")
    
    # Update fields
    if update.title is not None:
        task.title = update.title
    if update.status is not None:
        task.status = update.status
    if update.assignee_user_id is not None and user.role == UserRole.ADMIN:
        task.assignee_user_id = update.assignee_user_id
    
    task.version += 1
    db.commit()
    db.refresh(task)
    return task

@app.get("/health")
def health_check():
    return {"status": "OK"}

# Create tables on startup
@app.on_event("startup")
def on_startup():
    create_tables()