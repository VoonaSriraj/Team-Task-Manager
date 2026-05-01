import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await apiClient.get('projects/');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) {
      alert("Project name is required.");
      return;
    }
    
    try {
      await apiClient.post('projects/', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      await fetchProjects();
    } catch (err) {
      console.error("Create project error:", err);
      alert("Failed to create project. " + (err.response?.data?.detail || 'Please check your connection.'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await apiClient.delete(`projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert("Failed to delete. " + (err.response?.data?.detail || ''));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        {user?.role === 'admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-text-secondary">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(projects) ? projects : []).map(project => (
            <div key={project.id} className="glass-panel p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">{project.name}</h3>
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(project.id)} className="text-text-muted hover:text-danger transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className="text-text-secondary text-sm mb-6 flex-1 line-clamp-3">
                {project.description || 'No description provided.'}
              </p>
              <div className="mt-auto pt-4 border-t border-border-color text-xs text-text-muted flex justify-between">
                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full p-8 text-center text-text-secondary glass-panel border-dashed border-2">
              No projects found. {user?.role === 'admin' ? 'Create one to get started.' : 'Ask an admin to create a project.'}
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create New Project</h2>
            </div>
            
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Marketing Campaign"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-input h-32 resize-none"
                  placeholder="Describe the project goals..."
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
