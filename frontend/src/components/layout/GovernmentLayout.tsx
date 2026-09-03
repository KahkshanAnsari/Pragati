import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  Users,
  Sparkles,
  FileText,
  Rocket,
  Activity,
  ShoppingBag,
  ShieldCheck,
  AlertTriangle,
  Bell,
  LogOut,
  ChevronDown,
  HelpCircle,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'react-hot-toast';

const navItems = [
  { name: 'Dashboard', path: '/government/dashboard', icon: LayoutDashboard },
  { name: 'Problem Registry', path: '/government/problems', icon: FileSearch },
  { name: 'AI Matching', path: '/government/ai-matching', icon: Sparkles },
  { name: 'Startup Directory', path: '/government/startups', icon: Users },
  { name: 'Applications', path: '/government/applications', icon: FileText },
  { name: 'Pilot Management', path: '/government/pilots', icon: Rocket },
  { name: 'Monitoring', path: '/government/monitoring', icon: Activity },
  { name: 'Procurement Readiness', path: '/government/procurement', icon: ShoppingBag },
  { name: 'Validated Solutions', path: '/government/solutions', icon: ShieldCheck },
  { name: 'Compliance & Audit', path: '/government/compliance', icon: AlertTriangle },
];

export function GovernmentLayout() {
  const { profile, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const officerProfile = profile as {
    name?: string;
    designation?: string;
    department?: { name?: string; sector?: string };
  } | null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      {/* Light Professional GovTech Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col flex-shrink-0 z-20 shadow-xs">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy-900 text-white flex items-center justify-center font-black text-lg shadow-xs tracking-tight">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-navy-900 tracking-tight leading-none">PRAGATI</span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200">
                GOV
              </span>
            </div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">
              GovTech Procurement
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isMatchActive = item.name === 'AI Matching' && location.pathname.includes('/match');
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/government/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg text-xs transition-all ${
                        isActive || isMatchActive
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

        {/* Officer Profile Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {officerProfile?.name?.charAt(0) || 'O'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">
                {officerProfile?.name || 'Nodal Officer'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {officerProfile?.designation || 'Joint Commissioner'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Crisp Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 flex-shrink-0 z-10">
          {/* Left: Department Context */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-xs font-bold text-slate-900 truncate">
                {officerProfile?.department?.name || 'Water Resources Department, Nagpur'}
              </h2>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                Official Nodal Jurisdiction • Maharashtra Innovation Cell
              </p>
            </div>
          </div>

          {/* Right: Actions, Badges & Profile */}
          <div className="flex items-center space-x-3">
            {/* Help & Support Button (Visible in Header) */}
            <button
              onClick={() => toast('Pragati Support Desk: support@pragati.gov.in (Toll Free: 1800-11-2026)')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Help & Support</span>
            </button>

            {/* Role Badge */}
            <span className="hidden md:inline-flex items-center text-[11px] font-bold text-navy-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
              GOVERNMENT OFFICER
            </span>

            {/* Notifications Bell */}
            <button
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => navigate('/government/notifications')}
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
                <div className="w-7 h-7 bg-navy-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {officerProfile?.name?.charAt(0) || 'G'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[12rem] bg-white rounded-xl shadow-lg p-1.5 border border-slate-200 animate-in fade-in duration-150"
                  align="end"
                >
                  <div className="px-3 py-2 border-b border-slate-100 text-xs">
                    <p className="font-bold text-slate-900">{officerProfile?.name || 'Officer'}</p>
                    <p className="text-slate-500 text-[10px] truncate">{officerProfile?.department?.name || 'Gov Dept'}</p>
                  </div>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none"
                    onClick={() => navigate('/government/compliance')}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Compliance Trail
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

export default GovernmentLayout;
