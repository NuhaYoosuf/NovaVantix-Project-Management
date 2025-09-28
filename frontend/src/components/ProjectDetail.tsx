import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../api.tsx';
import type { Project, Task, TaskStatus, User } from '../types.js';

interface ProjectDetailProps {
  user: User;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id || '0');

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filters, setFilters] = useState<{ status?: string; assignee?: number }>({});

  useEffect(() => {
    if (projectId) {
      fetchProjectAndTasks();
    }
  }, [projectId, filters]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      // Fetch project details
      const projectsResponse = await projectsAPI.list();
      const foundProject = projectsResponse.data.find(p => p.id === projectId);
      setProject(foundProject || null);

      // Fetch tasks with filters
      const tasksResponse = await projectsAPI.getTasks(projectId, filters);
      setTasks(tasksResponse.data);
    } catch (err: any) {
      setError('Failed to fetch project data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await tasksAPI.create(projectId, { title: newTaskTitle });
      setNewTaskTitle('');
      setShowCreateTask(false);
      fetchProjectAndTasks(); // Refresh tasks
    } catch (err: any) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      await tasksAPI.update(taskId, {
        title: updates.title || '',
        status: updates.status,
        version: updates.version || 0
      }, updates.version || 0);
      
      // Optimistic update
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates, version: task.version + 1 } : task
      ));
    } catch (err: any) {
      if (err.response?.status === 409) {
        // Conflict - refresh data and show error
        setError('Task was modified by someone else. Please refresh.');
        fetchProjectAndTasks();
      } else {
        setError('Failed to update task');
      }
      console.error('Error updating task:', err);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        color: 'white',
        border: '2px solid #7c3aed'
      };
      case 'in_progress': return {
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        color: 'white',
        border: '2px solid #6d28d9'
      };
      case 'done': return {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        border: '2px solid #4f46e5'
      };
      default: return {
        background: 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)',
        color: '#6b7280',
        border: '2px solid #d1d5db'
      };
    }
  };

  const formatStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  if (loading) return <div className="loading">Loading project...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="projects-title-section">
          <button onClick={() => navigate('/projects')} className="back-to-projects-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </button>
          <h1>{project.name}</h1>
          {project.description && <p>{project.description}</p>}
        </div>
        <button 
          onClick={() => setShowCreateTask(!showCreateTask)}
          className="new-project-btn"
        >
          <span className="plus-icon">+</span>
          New Task
        </button>
      </div>

      <div className="search-filter-bar">
        <div className="filter-section">
          <select 
            value={filters.status || ''} 
            onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
            className="search-input"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {showCreateTask && (
        <div className="create-project-form-card">
          <h2>Create New Task</h2>
          <form onSubmit={handleCreateTask} className="create-project-form">
            <div className="form-group">
              <label htmlFor="taskTitle">Task Title <span className="required">*</span></label>
              <input
                id="taskTitle"
                type="text"
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-actions-create">
              <button type="submit" className="create-project-submit">
                <span className="plus-icon">+</span>
                Create Task
              </button>
              <button 
                type="button" 
                className="cancel-project-btn"
                onClick={() => setShowCreateTask(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks found</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="project-card">
              <div className="project-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="project-content">
                <div className="project-header-card">
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setTasks(prev => prev.map(t => 
                        t.id === task.id ? { ...t, title: newTitle } : t
                      ));
                    }}
                    onBlur={() => handleUpdateTask(task.id, { 
                      title: task.title, 
                      version: task.version 
                    })}
                    className="task-title-edit"
                  />
                  <span 
                    className="project-badge task-status-badge"
                    style={getStatusColor(task.status)}
                  >
                    {formatStatusText(task.status)}
                  </span>
                </div>
                
                <div className="project-meta">
                  <svg className="calendar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Assigned to User {task.assignee_user_id} • Version {task.version}
                  {task.due_date && ` • Due ${new Date(task.due_date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}`}
                </div>
                
                <div className="task-controls">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTask(task.id, { 
                      status: e.target.value as TaskStatus, 
                      version: task.version 
                    })}
                    className="task-status-select"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  
                  {user.role === 'admin' && (
                    <select
                      value={task.assignee_user_id}
                      onChange={(e) => handleUpdateTask(task.id, { 
                        assignee_user_id: parseInt(e.target.value), 
                        version: task.version 
                      })}
                      className="task-assignee-select"
                    >
                      <option value={1}>User 1</option>
                      <option value={2}>User 2</option>
                      <option value={3}>User 3</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;