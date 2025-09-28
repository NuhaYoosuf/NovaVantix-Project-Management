import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../api.tsx';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      console.log('Creating project:', newProject);
      await projectsAPI.create(newProject.name, newProject.description);
      navigate('/projects'); // Navigate back to projects list
    } catch (err: any) {
      console.error('Error creating project:', err);
      
      let errorMessage = 'Failed to create project';
      if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to create projects. Admin access required.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-page">
      <div className="create-project-header">
        <button 
          className="back-to-projects" 
          onClick={() => navigate('/projects')}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>
      </div>
      
      <div className="create-project-content">
        <div className="create-project-title">
          <h1>Create New Project</h1>
          <p>Set up a new project to start organizing your tasks</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="create-project-form-card">
          <h2>Project Details</h2>
          
          <form onSubmit={handleCreateProject} className="create-project-form">
            <div className="form-group">
              <label htmlFor="projectName">Project Name <span className="required">*</span></label>
              <input
                id="projectName"
                type="text"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="projectDescription">Description</label>
              <textarea
                id="projectDescription"
                rows={4}
                placeholder="Enter project description (optional)"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>
            
            <div className="form-actions-create">
              <button type="submit" className="create-project-submit" disabled={loading}>
                <span className="plus-icon">+</span>
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <button 
                type="button" 
                className="cancel-project-btn"
                onClick={() => navigate('/projects')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;