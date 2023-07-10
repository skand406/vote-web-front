import { createWebHistory, createRouter } from 'vue-router';
import HomeView from '../components/views/manager/ManagerHome.vue'
import LoginView from '../components/views/manager/ManagerLogin.vue'
import SignupView from '../components/views/manager/ManagerSignup.vue'


const routes = [
  {
    path: "/",
    component: HomeView
  },
  {
    path: "/login",
    component: LoginView
  },
  {
    path: "/signup",
    component: SignupView
  }
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;