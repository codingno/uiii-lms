import { Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
// import Login from './pages/Login';
import Login from './pages/LoginLms';
// import Register from './pages/Register';
import Register from './pages/RegisterLms';
import ResetPassword from './pages/ResetPassword';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import Categories from './pages/Categories';
import NotFound from './pages/Page404';

import CreateUser from './pages/user/CreateUser';
import CreateCategory from './pages/category/CreateCategory';

import Course from './pages/Courses'
import CreateCourse from './pages/course/CreateCourse'

// ----------------------------------------------------------------------

export default function Router() {
	const { user } = useSelector(state => state)

	const isLogin = (Component) => {
		return user.isLogin ? <Component /> : <Navigate to="/login" />
	}

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user',
					children: [
						{ element: <User />,},
						{ path: 'create', element: <CreateUser /> },
						{ path: 'edit', element: <CreateUser edit={true} /> },
					]
			 	},
        {
          path: 'courses',
          children: [
            { path: 'category', 
							children: [
								{ element: <Categories /> },
								{ path: 'create', element: <CreateCategory /> },
								{ path: 'edit', element: <CreateCategory edit={true} /> },
							]
					 	},
            { path: 'list', element: <Course /> },
            { path: 'create', element: <CreateCourse /> },
            { path: 'edit', element: <CreateCourse edit={true} /> },
            { path: 'enrollment', element: <Products /> }
          ]
        },
        { path: 'activity', element: <Products /> },
        { path: 'resources', element: <Products /> },
        { path: 'grades', element: <Products /> },
        { path: 'blog', element: <Blog /> }
      ]
    },
		{ path: '/login', element: !user.isLogin ? <Login /> : <Navigate to="/" /> },
		{ path: '/register', element: !user.isLogin ? <Register /> : <Navigate to="/" />},
		{ path: '/resetPassword/:token', element: !user.isLogin ? <ResetPassword /> : <Navigate to="/" />},
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '/', element: !user.isLogin ? <Navigate to="/login" /> : <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
