import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileText,
  Rocket,
  User,
  Bell,
  LogOut,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'react-hot-toast';

const navItems = [
  { name: 'Dashboard', path: '/startup/dashboard', icon: LayoutDashboard },
  { name: 'Discover Problems', path: '/startup/problems', icon: Compass },
  { name: 'My Applications', path: '/startup/applications', icon: FileText },
  { name: 'Active Pilots', path: '/startup/pilots', icon: Rocket },
  { name: 'My Profile', path: '/startup/profile', icon: User },
];

export function StartupLayout() {
  const { profile, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const startupProfile = profile as {
    name?: string;
    sector?: string;
    verification_status?: string;
  } | null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      {/* Light Clean Startup Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col flex-shrink-0 z-20 shadow-xs">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-xs tracking-tight">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-navy-900 tracking-tight leading-none">PRAGATI</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                STARTUP
              </span>
            </div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">
              Innovation Hub
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/startup/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg text-xs transition-all ${
                        isActive
                          ? 'bg-blue-50/90 text-blue-800 font-bold border-l-4 border-blue-600 pl-2.5 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 mr-2.5 opacity-85 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Startup Founder Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {startupProfile?.name?.charAt(0) || 'S'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">
                {startupProfile?.name || 'Startup'}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> DPIIT Verified
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 flex-shrink-0 z-10">
          {/* Left: Startup Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-xs font-bold text-slate-900 truncate">
                {startupProfile?.name || 'AquaSense Technologies'}
              </h2>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                DPIIT Registered Innovator • Sector: {startupProfile?.sector || 'Water & Wastewater'}
              </p>
            </div>
          </div>

          {/* Right: Actions, Badges & Profile */}
          <div className="flex items-center space-x-3">
            {/* Help & Support Button */}
            <button
              onClick={() => toast('Pragati Startup Desk: startup.support@pragati.gov.in (Toll Free: 1800-11-2026)')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Help & Support</span>
            </button>

            {/* Role Badge */}
            <span className="hidden md:inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              DPIIT STARTUP
            </span>

            {/* Notifications Bell */}
            <button
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => navigate('/startup/notifications')}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors outline-none cursor-pointer">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {startupProfile?.name?.charAt(0) || 'S'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[12rem] bg-white rounded-xl shadow-lg p-1.5 border border-slate-200 animate-in fade-in duration-150"
                  align="end"
                >
                  <div className="px-3 py-2 border-b border-slate-100 text-xs">
                    <p className="font-bold text-slate-900">{startupProfile?.name || 'Startup'}</p>
                    <p className="text-slate-500 text-[10px] truncate">{startupProfile?.sector || 'Innovation'}</p>
                  </div>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none"
                    onClick={() => navigate('/startup/profile')}
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" /> My Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StartupLayout;
