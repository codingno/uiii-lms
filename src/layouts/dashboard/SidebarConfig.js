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
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'User',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Courses',
    path: '/dashboard/courses',
    icon: getIcon(bookFill),
    children: [
      {
        title: 'Course',
        path: '/dashboard/courses/list'
      },
      {
        title: 'Enrollment',
        path: '/dashboard/courses/enrollment'
      }
    ]
  },
  {
    title: 'Activity',
    path: '/dashboard/activity',
    icon: getIcon(activityFill)
  },
  {
    title: 'Resources/materials',
    path: '/dashboard/resources',
    icon: getIcon(fileFill)
  },
  {
    title: 'Grades',
    path: '/dashboard/grades',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon(fileTextFill)
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
