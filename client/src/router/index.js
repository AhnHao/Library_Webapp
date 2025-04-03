import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ReaderDashboard from '../views/ReaderDashboard.vue';
import StaffDashboard from '../views/StaffDashboard.vue';
// import BorrowTracking from '../components/staff/BorrowTracking.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/reader',
    name: 'ReaderDashboard',
    component: ReaderDashboard,
    meta: { requiresAuth: true, role: 'reader' }
  },
  {
    path: '/staff',
    name: 'StaffDashboard',
    component: StaffDashboard,
    meta: { requiresAuth: true, role: 'staff' }
  },
  // {
  //   path: '/staff/borrow-tracking',
  //   name: 'BorrowTracking',
  //   component: BorrowTracking,
  //   meta: { requiresAuth: true, requiresStaff: true }
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.role && to.meta.role !== userRole) {
    next('/login');
  } else {
    next();
  }
});

export default router;