import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../api.tsx';
import type { Project } from '../types.js';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [searchTerm]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.list(searchTerm);
      setProjects(response.data);
    } catch (err: any) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };



  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="projects-title-section">
          <h1>Projects</h1>
          <p>Manage your projects and track progress</p>
        </div>
        <button 
          onClick={() => navigate('/create-project')}
          className="new-project-btn"
        >
          <span className="plus-icon">+</span>
          New Project
        </button>
      </div>

      <div className="search-container">
        <div className="search-box">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="empty-state">No projects found</div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="project-content">
                <div className="project-header-card">
                  <h3>{project.name}</h3>
                  <span className="project-badge">Project</span>
                </div>
                {project.description && <p className="project-description">{project.description}</p>}
                <div className="project-meta">
                  <svg className="calendar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Created {new Date(project.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                </div>
                <Link to={`/projects/${project.id}`} className="view-tasks-btn">
                  View Tasks
                </Link>
              </div>
            </div>
          ))
        )}
        </div>
    </div>
  );
};

export default Projects;