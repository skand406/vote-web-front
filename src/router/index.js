import { createWebHistory, createRouter } from 'vue-router';
import HomeView from '../components/views/Home.vue'
import LoginView from '../components/views/Login.vue'
import SignupView from '../components/views/Signup.vue'


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