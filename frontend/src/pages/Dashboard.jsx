import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiClient.get('tasks/');
        // Filter tasks assigned to the current user, or all if admin?
        // Let's just fetch all tasks for dashboard overview
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div className="animate-pulse">Loading dashboard...</div>;

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const userTasks = safeTasks.filter(t => t.assignee?.id === user?.id);
  const todo = safeTasks.filter(t => t.status === 'todo').length;
  const inProgress = safeTasks.filter(t => t.status === 'in_progress').length;
  const done = safeTasks.filter(t => t.status === 'done').length;
  const overdue = safeTasks.filter(t => t.status === 'overdue').length;

  return (
    <div className="animate-fade-in space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.full_name}!</h1>
        <p className="text-text-secondary">Here's what's happening with your projects today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-info">
          <div className="bg-info bg-opacity-20 p-3 rounded-lg text-info">
            <ListTodo size={24} />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">To Do</p>
            <h3 className="text-2xl font-bold text-white">{todo}</h3>
          </div>
        </div>
        
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-warning">
          <div className="bg-warning bg-opacity-20 p-3 rounded-lg text-warning">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">In Progress</p>
            <h3 className="text-2xl font-bold text-white">{inProgress}</h3>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-success">
          <div className="bg-success bg-opacity-20 p-3 rounded-lg text-success">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">Completed</p>
            <h3 className="text-2xl font-bold text-white">{done}</h3>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-danger">
          <div className="bg-danger bg-opacity-20 p-3 rounded-lg text-danger">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">Overdue</p>
            <h3 className="text-2xl font-bold text-white">{overdue}</h3>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="glass-panel p-6 mt-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-primary"></span>
          Your Tasks
        </h2>
        {userTasks.length === 0 ? (
          <p className="text-text-secondary">You have no assigned tasks.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-color text-text-secondary text-sm">
                  <th className="pb-3 font-medium">Task</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {userTasks.slice(0, 5).map(task => (
                  <tr key={task.id} className="border-b border-border-color hover:bg-bg-tertiary transition-colors">
                    <td className="py-4 font-medium text-white">{task.title}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${task.status === 'todo' ? 'bg-info bg-opacity-20 text-info' : ''}
                        ${task.status === 'in_progress' ? 'bg-warning bg-opacity-20 text-warning' : ''}
                        ${task.status === 'done' ? 'bg-success bg-opacity-20 text-success' : ''}
                        ${task.status === 'overdue' ? 'bg-danger bg-opacity-20 text-danger' : ''}
                      `}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-text-secondary">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
