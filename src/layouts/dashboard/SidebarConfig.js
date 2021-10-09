import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import fileFill from '@iconify/icons-eva/file-fill';
import activityFill from '@iconify/icons-eva/activity-fill';
import bookFill from '@iconify/icons-eva/book-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard/app',
    role:[8],
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'User',
    path: '/dashboard/user',
    role: [1],
    icon: getIcon(peopleFill)
  },
  {
    title: 'Courses',
    path: '/dashboard/courses',
    icon: getIcon(bookFill),
    role: [8],
    children: [
      {
        title: 'Course Category',
        path: '/dashboard/courses/category',
        role: [8]
      },
      {
        title: 'Course',
        path: '/dashboard/courses/list',
        role: [8]
      },
      {
        title: 'Enrollment',
        path: '/dashboard/courses/enrollment',
        role: [8,4]
      }
    ]
  },
  {
    title: 'Activity',
    path: '/dashboard/activity',
    icon: getIcon(activityFill),
    role: [8]
  },
  {
    title: 'Resources/materials',
    path: '/dashboard/resources',
    icon: getIcon(fileFill),
    role: [8]
  },
  {
    title: 'Grades',
    path: '/dashboard/grades',
    icon: getIcon(shoppingBagFill),
    role: [1,4,7]
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon(fileTextFill),
    role:[8]
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon(lockFill)
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon(personAddFill)
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon(alertTriangleFill)
  }
];

export default sidebarConfig;
