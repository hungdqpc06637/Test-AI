import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Views
import Dashboard from '@/views/Dashboard.vue'
import Reports from '@/views/Reports.vue'
import Users from '@/views/Users.vue'
import Settings from '@/views/Settings.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard', icon: 'dashboard' }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: Reports,
        meta: { title: 'Báo cáo', icon: 'bar-chart' }
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: { title: 'Người dùng', icon: 'user' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: { title: 'Cài đặt', icon: 'setting' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export default routes
