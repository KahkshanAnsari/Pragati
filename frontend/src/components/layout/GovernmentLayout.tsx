import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
      { name: 'Dashboard',        path: '/government/dashboard',   icon: LayoutDashboard },
      { name: 'Problem Registry', path: '/government/problems',    icon: FileSearch },
      { name: 'AI Matching',      path: '/government/ai-matching', icon: Sparkles },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Startup Directory', path: '/government/startups',     icon: Users },
      { name: 'Applications',      path: '/government/applications', icon: FileText },
      { name: 'Pilot Management',  path: '/government/pilots',       icon: Rocket },
      { name: 'Monitoring',        path: '/government/monitoring',   icon: Activity },
    ],
  },
  {
    label: 'Outcomes',
    items: [
      { name: 'Procurement Readiness', path: '/government/procurement', icon: ShoppingBag },
      { name: 'Validated Solutions',   path: '/government/solutions',   icon: ShieldCheck },
      { name: 'Compliance & Audit',    path: '/government/compliance',  icon: AlertTriangle },
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

  // Single-item active logic to fix the active menu bug permanently
  const isNavActive = (itemPath: string) => {
    const current = location.pathname;
    if (itemPath === '/government/dashboard') {
      return current === '/government/dashboard' || current === '/government';
    }
    if (itemPath === '/government/ai-matching') {
      return current.includes('/match') || current.startsWith('/government/ai-matching') || current.startsWith('/government/matching');
    }
    if (itemPath === '/government/problems') {
      return current.startsWith('/government/problems') && !current.includes('/match');
    }
    if (itemPath === '/government/monitoring') {
      return current.startsWith('/government/monitoring');
    }
    if (itemPath === '/government/pilots') {
      return current.startsWith('/government/pilots') && !current.startsWith('/government/monitoring');
    }
    return current.startsWith(itemPath);
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
              GOV
            </span>
          </div>
          <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-widest mt-0.5">
            GovTech Procurement
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">{section.label}</p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.path);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
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
                    </Link>
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
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {officerProfile?.name || 'Government Officer'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {officerProfile?.department?.name || 'Department of Innovation'}
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

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700 truncate max-w-[320px]">
                {officerProfile?.department?.name || 'National Procurement Mission'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-400">SIH 2026 GovTech Edition</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Notifications */}
            <Link
              to="/government/notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </Link>

            {/* Profile Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {initials}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 hidden sm:block">
                    {officerProfile?.name?.split(' ')[0] || 'Officer'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[190px] bg-white rounded-xl p-1 shadow-dropdown border border-slate-200 text-xs z-50"
                  sideOffset={6}
                  align="end"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-900">{officerProfile?.name || 'Officer'}</p>
                    <p className="text-[10px] text-slate-400">{officerProfile?.designation || 'Nodal Officer'}</p>
                  </div>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer outline-none"
                    onClick={() => navigate('/government/problems/new')}
                  >
                    Post a Problem
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer outline-none"
                    onClick={() => navigate('/government/ai-matching')}
                  >
                    AI Startup Matching
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
