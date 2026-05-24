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
  TrendingUp,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, sidebarOpen, setSidebarOpen } = useContext(AuthContext);

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
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 text-white flex flex-col border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:flex flex-shrink-0`}
        style={{ backgroundColor: '#0747A6', borderRightColor: '#0052CC' }}
      >
        {/* Brand Logo Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderBottomColor: 'rgba(255,255,255,0.15)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-lg" style={{ color: '#0052CC' }}>
              M
            </div>
            <div className="leading-tight">
              <span className="font-bold text-white text-lg tracking-wide block">MFG-CRM</span>
              <span className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Manufacturing</span>
            </div>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-blue-100 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-[#0052CC] shadow-md shadow-black/5'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
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
        <div className="p-4 border-t" style={{ borderTopColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <div className="text-xs">
              <span className="text-blue-200 block">Workspace Mode</span>
              <span className="font-semibold text-white capitalize">{user.role} Portal</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
