import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Compass, FileText, Rocket, User,
  Bell, LogOut, ChevronDown, HelpCircle, ShieldCheck, CheckCircle2,
  Menu, X,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'react-hot-toast';

const navItems = [
  { name: 'Dashboard',        path: '/startup/dashboard',    icon: LayoutDashboard },
  { name: 'Discover Problems',path: '/startup/problems',     icon: Compass },
  { name: 'My Applications',  path: '/startup/applications', icon: FileText },
  { name: 'Active Pilots',    path: '/startup/pilots',       icon: Rocket },
  { name: 'My Profile',       path: '/startup/profile',      icon: User },
];

export function StartupLayout() {
  const { profile, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
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

  const isVerified = startupProfile?.verification_status === 'verified';
  const initials = startupProfile?.name
    ? startupProfile.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'ST';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
          P
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-navy-900 tracking-tight leading-none">PRAGATI</span>
            <span className="text-[9px] font-bold bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200">
              STARTUP
            </span>
          </div>
          <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-widest mt-0.5">
            Innovation Hub
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5">
        <p className="section-label px-3 mb-2">Navigation</p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === '/startup/dashboard'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-xs transition-all duration-150 ${
                      isActive
                        ? 'bg-teal-600 text-white font-semibold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-2.5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Startup Footer */}
      <div className="p-3 border-t border-slate-100 shrink-0">
        {/* Verification badge */}
        {isVerified && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-2 bg-teal-50 rounded-lg border border-teal-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="text-[10px] font-bold text-teal-700">Verified Startup</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="truncate flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{startupProfile?.name || 'Startup'}</p>
            <p className="text-[10px] text-slate-500 truncate">{startupProfile?.sector || 'Technology'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 shadow-sidebar
          flex flex-col flex-shrink-0 transition-transform duration-250
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close */}
        <button
          className="absolute top-4 right-3 lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-10 shadow-xs">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{startupProfile?.name || 'Startup'}</p>
                <p className="text-[10px] text-slate-500">{startupProfile?.sector || 'Technology'}</p>
              </div>
            </div>
            {isVerified && (
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Verified
              </span>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast('PRAGATI Support: support@pragati.gov.in', { icon: '🚀' })}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Help
            </button>

            <span className="hidden lg:inline-flex items-center text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
              STARTUP PORTAL
            </span>

            {/* Notifications */}
            <button
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => navigate('/startup/notifications')}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-100 rounded-lg transition-colors outline-none cursor-pointer">
                <div className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[13rem] bg-white rounded-xl shadow-dropdown p-1.5 border border-slate-200 animate-in fade-in duration-150"
                  align="end"
                  sideOffset={6}
                >
                  <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-900 text-xs">{startupProfile?.name || 'Startup'}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{startupProfile?.sector || 'Technology'}</p>
                  </div>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none"
                    onClick={() => navigate('/startup/profile')}
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    My Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 border-t border-slate-100" />
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StartupLayout;
