import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileSearch, Users, Sparkles, FileText, Rocket,
  Activity, ShoppingBag, ShieldCheck, AlertTriangle, Bell, LogOut,
  ChevronDown, HelpCircle, Building2, ExternalLink, ChevronRight, X, Menu,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'react-hot-toast';

const NAV_SECTIONS = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard',       path: '/government/dashboard', icon: LayoutDashboard },
      { name: 'Problem Registry',path: '/government/problems',  icon: FileSearch },
      { name: 'AI Matching',     path: '/government/ai-matching', icon: Sparkles },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Startup Directory',    path: '/government/startups',     icon: Users },
      { name: 'Applications',         path: '/government/applications',  icon: FileText },
      { name: 'Pilot Management',     path: '/government/pilots',        icon: Rocket },
      { name: 'Monitoring',           path: '/government/monitoring',    icon: Activity },
    ],
  },
  {
    label: 'Outcomes',
    items: [
      { name: 'Procurement Readiness',path: '/government/procurement', icon: ShoppingBag },
      { name: 'Validated Solutions',  path: '/government/solutions',   icon: ShieldCheck },
      { name: 'Compliance & Audit',   path: '/government/compliance',  icon: AlertTriangle },
    ],
  },
];

export function GovernmentLayout() {
  const { profile, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const officerProfile = profile as {
    name?: string;
    designation?: string;
    department?: { name?: string; sector?: string };
  } | null;

  const initials = officerProfile?.name
    ? officerProfile.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'GO';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-black text-sm shadow-sm">
          P
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-navy-900 tracking-tight leading-none">PRAGATI</span>
            <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
              GOV
            </span>
          </div>
          <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-widest mt-0.5">
            GovTech Procurement
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="section-label px-3 mb-1.5">{section.label}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isMatchActive = item.name === 'AI Matching' && location.pathname.includes('/match');
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/government/dashboard'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-lg text-xs transition-all duration-150 ${
                          isActive || isMatchActive
                            ? 'bg-navy-900 text-white font-semibold shadow-sm'
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
          </div>
        ))}
      </nav>

      {/* Officer Footer */}
      <div className="p-3 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="truncate flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{officerProfile?.name || 'Government Officer'}</p>
            <p className="text-[10px] text-slate-500 truncate">{officerProfile?.designation || 'Officer'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* Mobile sidebar overlay */}
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
        {/* Mobile close btn */}
        <button
          className="absolute top-4 right-3 lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-10 shadow-xs">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-xs font-bold text-slate-900 truncate">
                {officerProfile?.department?.name || 'Water Resources Department, Nagpur'}
              </h2>
              <p className="text-[10px] text-slate-500 font-medium truncate hidden sm:block">
                Official Nodal Jurisdiction • Maharashtra Innovation Cell
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Help */}
            <button
              onClick={() => toast('PRAGATI Support: support@pragati.gov.in', { icon: '🏛️' })}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Help
            </button>

            {/* Role badge */}
            <span className="hidden lg:inline-flex items-center text-[10px] font-bold text-navy-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
              GOV OFFICER
            </span>

            {/* Notifications */}
            <button
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => navigate('/government/notifications')}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold animate-pulse-soft">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors outline-none cursor-pointer">
                <div className="w-7 h-7 bg-navy-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
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
                    <p className="font-bold text-slate-900 text-xs">{officerProfile?.name || 'Officer'}</p>
                    <p className="text-slate-500 text-[10px] truncate mt-0.5">{officerProfile?.department?.name || 'Government Department'}</p>
                  </div>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none transition-colors"
                    onClick={() => navigate('/government/compliance')}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    Compliance Trail
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 border-t border-slate-100" />
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none transition-colors"
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

export default GovernmentLayout;
