import { createWebHistory, createRouter } from 'vue-router';
import HomeView from '../components/views/manager/ManagerHome.vue'
import LoginView from '../components/views/manager/ManagerLogin.vue'
import SignupView from '../components/views/manager/ManagerSignup.vue'
import VoteView from '../components/views/manager/ManagerVote.vue'
import MyPageView from '../components/views/manager/ManagerMyPage.vue'
import FindView from '../components/views/manager/ManagerFind.vue'
import TestView from '../components/Test.vue'


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
  },
  {
    path: "/vote",
    component: VoteView
  },
  {
    path: "/my",
    component: MyPageView
  }
  ,
  {
    path: "/find/:type",
    component: FindView,
    name: "find",
    props: true
  }
  ,
  {
    path: "/test",
    component: TestView
  }
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;