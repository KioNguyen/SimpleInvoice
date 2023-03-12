import { useContext, useEffect } from 'react';
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
import InvoicePage from './pages/InvoicePage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import SimpleLayout from './layouts/simple';
import DashboardLayout from './layouts/dashboard';
import { AuthContext } from './context/AuthContext';

// ----------------------------------------------------------------------

export default function Router() {

  const { user } = useContext(AuthContext)

  const navigate = useNavigate();
  const routes = useRoutes(
    [{
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/user" />, index: true },
        { path: 'user', element: <InvoicePage /> },
      ],
    },
    {
      path: 'login',
      element: <Navigate to="/dashboard/user" />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/blog" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    }]

  );

  return routes;
}

