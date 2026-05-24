import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Target, 
  ShieldCheck, 
  CalendarRange, 
  PackageSearch, 
  Users2, 
  TrendingUp 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  // Base navigation links for all roles
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/leads', label: 'Leads', icon: Target },
    { to: '/clients', label: 'Clients', icon: ShieldCheck },
    { to: '/followups', label: 'Follow-ups', icon: CalendarRange },
    { to: '/products', label: 'Products', icon: PackageSearch },
    { to: '/reports', label: 'Reports', icon: TrendingUp }
  ];

  // Admin only manages Team
  if (user.role === 'admin') {
    links.push({ to: '/team', label: 'Team overview', icon: Users2 });
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800">
      {/* Brand Logo Header */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          M
        </div>
        <div className="leading-tight">
          <span className="font-bold text-white text-lg tracking-wide block">MFG-CRM</span>
          <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold">Manufacturing</span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Active Role Indicator */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <div className="text-xs">
            <span className="text-slate-500 block">Workspace Mode</span>
            <span className="font-semibold text-slate-300 capitalize">{user.role} Portal</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
