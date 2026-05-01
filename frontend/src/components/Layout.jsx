import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 glass-panel m-4 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
            <span className="text-accent-primary">■</span> TTM
          </h1>
        </div>
        
        <div className="px-4 py-2 border-b border-border-color mb-4">
          <p className="text-sm text-text-secondary">Logged in as:</p>
          <p className="font-medium text-white truncate">{user?.full_name}</p>
          <span className="inline-block mt-1 text-xs px-2 py-1 bg-accent-light text-accent-primary rounded-full uppercase tracking-wider font-semibold">
            {user?.role}
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path 
                  ? 'bg-accent-primary text-white shadow-glow' 
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border-color">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-text-secondary hover:bg-danger hover:bg-opacity-10 hover:text-danger rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-bg-secondary border-b border-border-color shrink-0">
          <h1 className="text-lg font-bold">TTM</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-text-secondary hover:text-white">
            <Menu size={24} />
          </button>
        </header>
 
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
