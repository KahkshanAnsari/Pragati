import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Compass, FileText, Rocket, User,
  Bell, LogOut, ChevronDown, CheckCircle2,
  Menu, X, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const navItems = [
  { name: 'Dashboard',        path: '/startup/dashboard',    icon: LayoutDashboard, exact: true },
  { name: 'Discover Problems',path: '/startup/problems',     icon: Compass },
  { name: 'My Applications',  path: '/startup/applications', icon: FileText },
  { name: 'Active Pilots',    path: '/startup/pilots',       icon: Rocket },
  { name: 'My Profile',       path: '/startup/profile',      icon: User },
];

export function StartupLayout() {
  const { profile, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const startupProfile = profile as {
    name?: string;
    sector?: string;
    verification_status?: string;
  } | null;

  const initials = startupProfile?.name
    ? startupProfile.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'ST';

  const isNavActive = (itemPath: string, exact?: boolean) => {
    if (exact) return location.pathname === itemPath;
    return location.pathname.startsWith(itemPath);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-black text-sm shadow-sm">
          P
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-navy-900 tracking-tight leading-none">PRAGATI</span>
            <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
              STARTUP
            </span>
          </div>
          <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-widest mt-0.5">
            Innovator Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Startup Workspace</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item.path, item.exact);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                active
                  ? 'bg-navy-900 text-white shadow-[0_0_15px_-3px_rgba(37,99,235,0.45)] ring-1 ring-blue-600/30'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-r" />
              )}
              <Icon className={`w-4 h-4 mr-2.5 shrink-0 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Startup Footer */}
      <div className="p-3 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {startupProfile?.name || 'Verified Startup'}
            </p>
            <p className="text-[10px] text-blue-600 font-medium truncate flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> DPIIT Recognized
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Desktop Floating Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 shadow-card">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] z-10 flex flex-col shadow-modal">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-500 hover:bg-slate-100 z-20"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">
                {startupProfile?.name || 'AquaSense AI'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                {startupProfile?.sector || 'GovTech Innovation'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                DPIIT Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/startup/problems')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              Discover Challenges
            </button>

            <NavLink
              to="/startup/notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </NavLink>

            {/* Profile Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {initials}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[180px] bg-white rounded-xl p-1 shadow-dropdown border border-slate-200 text-xs z-50"
                  sideOffset={6}
                  align="end"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-900">{startupProfile?.name || 'Startup Innovator'}</p>
                    <p className="text-[10px] text-blue-600 font-semibold">DPIIT Verified</p>
                  </div>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer outline-none"
                    onClick={() => navigate('/startup/profile')}
                  >
                    Manage Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer outline-none"
                    onClick={() => navigate('/startup/applications')}
                  >
                    My Applications
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer outline-none font-medium"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
