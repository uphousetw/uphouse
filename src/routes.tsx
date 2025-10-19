import { createBrowserRouter } from 'react-router-dom'

import { RequireAuth } from './components/RequireAuth'
import { AdminLayout } from './layout/AdminLayout'
import { MainLayout } from './layout/MainLayout'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { AdminAboutPage } from './pages/admin/AdminAboutPage'
import { AdminContactPageContent } from './pages/admin/AdminContactPageContent'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminHomePageContent } from './pages/admin/AdminHomePageContent'
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage'
import { AdminProjectFormPage } from './pages/admin/AdminProjectFormPage'
import { AdminProjectsPageContent } from './pages/admin/AdminProjectsPageContent'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: (
      <RequireAuth role="editor">
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'projects', element: <AdminProjectsPage /> },
      { path: 'projects/new', element: <AdminProjectFormPage /> },
      { path: 'projects/:slug/edit', element: <AdminProjectFormPage /> },
      {
        path: 'content/homepage',
        element: (
          <RequireAuth role="admin">
            <AdminHomePageContent />
          </RequireAuth>
        ),
      },
      {
        path: 'content/projects-page',
        element: (
          <RequireAuth role="admin">
            <AdminProjectsPageContent />
          </RequireAuth>
        ),
      },
      {
        path: 'content/contact-page',
        element: (
          <RequireAuth role="admin">
            <AdminContactPageContent />
          </RequireAuth>
        ),
      },
      {
        path: 'content/about',
        element: (
          <RequireAuth role="admin">
            <AdminAboutPage />
          </RequireAuth>
        ),
      },
      {
        path: 'settings',
        element: (
          <RequireAuth role="admin">
            <AdminSettingsPage />
          </RequireAuth>
        ),
      },
      {
        path: 'leads',
        element: (
          <RequireAuth role="admin">
            <AdminLeadsPage />
          </RequireAuth>
        ),
      },
    ],
  },
])
