import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Rocket, AlertCircle, FileText, BarChart, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Departments', path: '/admin/departments', icon: Building },
  { name: 'Startups', path: '/admin/startups', icon: Rocket },
  { name: 'Verification', path: '/admin/verification', icon: FileText },
  { name: 'Problems', path: '/admin/problems', icon: AlertCircle },
  { name: 'Pilots', path: '/admin/pilots', icon: Rocket },
  { name: 'Reports', path: '/admin/reports', icon: FileText },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
];

export function AdminLayout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-gray-800">
          Pragati <span className="text-red-400 ml-2 text-sm font-normal">Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink to={item.path} className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-gray-800 text-white font-medium' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                  <item.icon className="w-5 h-5 mr-3 opacity-75" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
              <div className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-50 min-w-[8rem] bg-white rounded-md shadow-md p-1 border border-gray-200" align="end">
                <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
