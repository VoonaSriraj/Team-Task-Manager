import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', description: '', status: 'todo', project_id: '', assignee_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projRes, usersRes] = await Promise.all([
        apiClient.get('/tasks'),
        apiClient.get('/projects'),
        apiClient.get('/users')
      ]);
      setTasks(tasksRes.data);
      setProjects(projRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const taskPayload = { ...newTask };
      if (!taskPayload.assignee_id) delete taskPayload.assignee_id;
      
      await apiClient.post(`/tasks?project_id=${taskPayload.project_id}`, taskPayload);
      setShowModal(false);
      setNewTask({ title: '', description: '', status: 'todo', project_id: '', assignee_id: '' });
      fetchData();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await apiClient.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Kanban Board Columns
  const columns = ['todo', 'in_progress', 'done', 'overdue'];
  const columnTitles = {
    'todo': 'To Do',
    'in_progress': 'In Progress',
    'done': 'Done',
    'overdue': 'Overdue'
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Task Board</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> New Task
        </button>
      </div>

      {loading ? (
        <div className="text-text-secondary">Loading board...</div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
          {columns.map(status => (
            <div key={status} className="flex-1 min-w-[300px] glass-panel bg-opacity-30 p-4 rounded-xl flex flex-col h-full max-h-[calc(100vh-200px)]">
              <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-wider border-b border-border-color pb-2 flex justify-between items-center">
                {columnTitles[status]}
                <span className="bg-bg-tertiary px-2 py-0.5 rounded-full text-text-secondary">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {tasks.filter(t => t.status === status).map(task => (
                  <div key={task.id} className="bg-bg-secondary border border-border-color p-4 rounded-lg shadow-md hover:border-accent-primary transition-colors group">
                    <h4 className="font-medium text-white text-sm mb-1">{task.title}</h4>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-3">{task.description}</p>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-color">
                      <div className="flex items-center gap-2">
                        {task.assignee ? (
                          <div className="w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-xs font-bold" title={task.assignee.full_name}>
                            {task.assignee.full_name.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <div className="text-xs text-text-muted">Unassigned</div>
                        )}
                      </div>
                      
                      <select 
                        className="text-xs bg-bg-tertiary border border-border-color rounded px-2 py-1 outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="glass-panel p-6 w-full max-w-md animate-fade-in bg-bg-secondary">
            <h2 className="text-xl font-bold mb-4 text-white">Create New Task</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Project</label>
                <select 
                  className="form-input" 
                  value={newTask.project_id}
                  onChange={e => setNewTask({...newTask, project_id: e.target.value})}
                  required
                >
                  <option value="">Select a project...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Assignee (Optional)</label>
                  <select 
                    className="form-input" 
                    value={newTask.assignee_id}
                    onChange={e => setNewTask({...newTask, assignee_id: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input" 
                    value={newTask.status}
                    onChange={e => setNewTask({...newTask, status: e.target.value})}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input h-20 resize-none"
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!newTask.project_id}>
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
