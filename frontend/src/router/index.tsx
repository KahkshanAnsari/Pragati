import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

// Layouts
import { GovernmentLayout } from '../components/layout/GovernmentLayout';
import { StartupLayout } from '../components/layout/StartupLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Landing & Auth
import { Landing } from '../pages/Landing';
import { GovernmentLogin } from '../pages/auth/GovernmentLogin';
import { GovernmentRegister } from '../pages/auth/GovernmentRegister';
import { StartupLogin } from '../pages/auth/StartupLogin';
import { StartupRegister } from '../pages/auth/StartupRegister';

// Government Pages
import { GovernmentDashboard } from '../pages/government/Dashboard';
import { ProblemRegistry } from '../pages/government/ProblemRegistry';
import { PostProblem } from '../pages/government/PostProblem';
import { AIMatching } from '../pages/government/AIMatching';
import { AIMatchingLanding } from '../pages/government/AIMatchingLanding';
import { StartupDirectory } from '../pages/government/StartupDirectory';
import { StartupProfile as GovStartupProfile } from '../pages/government/StartupProfile';
import { Applications } from '../pages/government/Applications';
import { EvaluationForm } from '../pages/government/EvaluationForm';
import { PilotManagement } from '../pages/government/PilotManagement';
import { PilotWorkspace as GovPilotWorkspace } from '../pages/government/PilotWorkspace';
import { FieldInspection } from '../pages/government/FieldInspection';
import { IssueReporting } from '../pages/government/IssueReporting';
import { PilotOutcome } from '../pages/government/PilotOutcome';
import { ProcurementOverview } from '../pages/government/ProcurementOverview';
import { ProcurementReadiness } from '../pages/government/ProcurementReadiness';
import { ValidatedSolutions } from '../pages/government/ValidatedSolutions';
import { ComplianceOverview } from '../pages/government/ComplianceOverview';

// Startup Pages
import { StartupDashboard } from '../pages/startup/Dashboard';
import { DiscoverProblems } from '../pages/startup/DiscoverProblems';
import { ApplicationForm } from '../pages/startup/ApplicationForm';
import { StartupApplications } from '../pages/startup/StartupApplications';
import { ActivePilots } from '../pages/startup/ActivePilots';
import { PilotWorkspace as StartupPilotWorkspace } from '../pages/startup/PilotWorkspace';
import { StartupProfile } from '../pages/startup/StartupProfile';

// Shared Pages
import { ProblemDetails } from '../pages/common/ProblemDetails';
import { NotificationsPage } from '../pages/common/NotificationsPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/Dashboard';
import AdminStartupsPage from '../pages/admin/Startups';
import AdminAnalyticsPage from '../pages/admin/Analytics';

// Fallback page
function NotFound() {
  return (
    <div className="p-12 text-center max-w-md mx-auto my-12 bg-white rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-navy-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6 text-sm">
        The page you are trying to access does not exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-block px-5 py-2.5 bg-navy-900 text-white text-sm font-semibold rounded-lg hover:bg-navy-800 transition-colors"
      >
        Return to Home
      </a>
    </div>
  );
}

// Protected layout — wraps role-specific layouts
function ProtectedLayout({ allowedRoles }: { allowedRoles: Array<'government_officer' | 'startup' | 'admin'> }) {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);

  if (!user) return <Navigate to="/" replace />;
  if (role && !allowedRoles.includes(role)) {
    if (role === 'government_officer') return <Navigate to="/government/dashboard" replace />;
    if (role === 'startup') return <Navigate to="/startup/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }
  return <Outlet />;
}

const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <Landing /> },
  { path: '/auth/government/login', element: <GovernmentLogin /> },
  { path: '/auth/government/register', element: <GovernmentRegister /> },
  { path: '/auth/startup/login', element: <StartupLogin /> },
  { path: '/auth/startup/register', element: <StartupRegister /> },

  // Government portal
  {
    path: '/government',
    element: <ProtectedLayout allowedRoles={['government_officer']} />,
    children: [
      {
        element: <GovernmentLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <GovernmentDashboard /> },
          { path: 'problems', element: <ProblemRegistry /> },
          { path: 'problems/new', element: <PostProblem /> },
          { path: 'problems/:id', element: <ProblemDetails /> },
          { path: 'problems/:id/match', element: <AIMatching /> },
          { path: 'ai-matching', element: <AIMatchingLanding /> },
          { path: 'matching', element: <AIMatchingLanding /> },
          { path: 'startups', element: <StartupDirectory /> },
          { path: 'startups/:id', element: <GovStartupProfile /> },
          { path: 'applications', element: <Applications /> },
          { path: 'applications/:id', element: <EvaluationForm /> },
          { path: 'applications/:id/evaluate', element: <EvaluationForm /> },
          { path: 'pilots', element: <PilotManagement /> },
          { path: 'pilots/:id', element: <GovPilotWorkspace /> },
          { path: 'pilots/:id/workspace', element: <GovPilotWorkspace /> },
          { path: 'pilots/:id/inspection', element: <FieldInspection /> },
          { path: 'pilots/:id/issues', element: <IssueReporting /> },
          { path: 'pilots/:id/outcome', element: <PilotOutcome /> },
          { path: 'monitoring', element: <PilotManagement /> },
          { path: 'procurement', element: <ProcurementOverview /> },
          { path: 'procurement/:id', element: <ProcurementReadiness /> },
          { path: 'solutions', element: <ValidatedSolutions /> },
          { path: 'compliance', element: <ComplianceOverview /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },

  // Startup portal
  {
    path: '/startup',
    element: <ProtectedLayout allowedRoles={['startup']} />,
    children: [
      {
        element: <StartupLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <StartupDashboard /> },
          { path: 'problems', element: <DiscoverProblems /> },
          { path: 'problems/:id', element: <ProblemDetails /> },
          { path: 'problems/:id/apply', element: <ApplicationForm /> },
          { path: 'applications', element: <StartupApplications /> },
          { path: 'applications/:id', element: <StartupApplications /> },
          { path: 'startups/:id', element: <GovStartupProfile /> },
          { path: 'pilots', element: <ActivePilots /> },
          { path: 'pilots/:id', element: <StartupPilotWorkspace /> },
          { path: 'pilots/:id/workspace', element: <StartupPilotWorkspace /> },
          { path: 'profile', element: <StartupProfile /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },

  // Admin portal
  {
    path: '/admin',
    element: <ProtectedLayout allowedRoles={['admin']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'startups', element: <AdminStartupsPage /> },
          { path: 'analytics', element: <AdminAnalyticsPage /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
