import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
// import Login from './pages/Login';
import Login from './pages/LoginLms';
// import Register from './pages/Register';
import Register from './pages/RegisterLms';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        {
          path: 'courses',
          children: [
            { path: 'list', element: <User /> },
            { path: 'enrollment', element: <Products /> }
          ]
        },
        { path: 'activity', element: <Products /> },
        { path: 'resources', element: <Products /> },
        { path: 'grades', element: <Products /> },
        { path: 'blog', element: <Blog /> }
      ]
    },
		{ path: '/login', element: <Login /> },
		{ path: '/register', element: <Register /> },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
