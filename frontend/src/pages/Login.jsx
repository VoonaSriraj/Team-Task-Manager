import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <div className="glass-panel p-8 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-accent-light p-3 rounded-full">
            <LogIn className="w-8 h-8 text-accent-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        {error && <div className="bg-danger text-white p-3 rounded mb-4 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full py-2">
            Sign In
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-text-secondary">
          Don't have an account? <Link to="/signup" className="text-accent-primary font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
