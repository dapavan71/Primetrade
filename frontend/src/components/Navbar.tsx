import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <CheckSquare /> PrimeTrade Tasks
        </Link>
        
        <div>
          {token ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-indigo-700 px-4 py-2 rounded transition"
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="hover:text-indigo-200 transition">Login</Link>
              <Link to="/register" className="hover:text-indigo-200 transition">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
