import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user, logout, setSidebarOpen } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-100 px-4 md:px-8 py-4 md:py-6 shadow-sm">
      <div className="flex items-center gap-3">
        {user && (
          <button 
            onClick={() => setSidebarOpen(prev => !prev)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu size={22} />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">{title || 'Dashboard'}</h1>
      </div>

      {user && (
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="text-sm hidden sm:block">
              <p className="font-semibold text-gray-700 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize mt-0.5">{user.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg transition-all"
          >
            <LogOut size={16} />
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
