import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';
import CheckEmailView from '../views/CheckEmailView.vue';
import EmailConfirmedView from '../views/EmailConfirmedView.vue'; // Import the email confirmed view
import SignupView from '../views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/check-email',
      name: 'check-email',
      component: CheckEmailView
    },
    {
      path: '/auth/confirmed',
      name: 'email-confirmed',
      component: EmailConfirmedView
    },
    {
      path: '/register',
      name: 'register',
      component: SignupView
    }
  ]
})

export default router

