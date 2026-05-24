import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-100 px-8 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{title || 'Dashboard'}</h1>

      {user && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User size={18} />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-700 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize mt-0.5">{user.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
