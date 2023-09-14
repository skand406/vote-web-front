import { createWebHistory, createRouter } from "vue-router";
// import { store } from '../store' // Vuex 스토어 import
import ManagerContainer from "../components/views/manager/ManagerContainer.vue";
import ManagerHome from "../components/views/manager/ManagerHome.vue";
import ManagerLogin from "../components/views/manager/ManagerLogin.vue";
import ManagerSignup from "../components/views/manager/ManagerSignup.vue";
import ManagerRegister from "../components/views/manager/ManagerVote.vue";
import ManagerFind from "../components/views/manager/ManagerFind.vue";

import ManagerMyContainer from "../components/views/manager/ManagerMyContainer.vue";
import ManagerMy from "../components/views/manager/ManagerMyPage.vue";
import ManagerMyVoteList from "../components/views/manager/ManagerMyVoteList.vue";
import ManagerMyVoteDetail from "../components/views/manager/ManagerMyVoteDetail.vue";

import UserContainer from "../components/views/user/UserContainer.vue";
import UserVoteList from "../components/views/user/UserVoteList.vue";
import userVoteDetail from "../components/views/user/UserVoteCandidate.vue";
import UserVote from "../components/views/user/UserVote.vue";
import UserAuth from "../components/views/user/UserAuth.vue";
import UserVoting from "../components/views/user/UserVoting.vue";

import MyPageView from "../components/views/manager/ManagerMyPage.vue";
import TestView from "../components/Test.vue";

import AdminContainer from "../components/views/admin/AdminContainer.vue";
import AdminMain from "@/components/views/admin/AdminMain";
import AdminVoteDetail from "@/components/views/admin/AdminVoteDetail";

const routes = [
  {
    path: "/",
    component: ManagerContainer,
    children: [
      {
        path: "",
        component: ManagerHome,
      },
      {
        path: "login",
        component: ManagerLogin,
      },
      {
        path: "signup",
        component: ManagerSignup,
      },
      {
        path: "register",
        component: ManagerRegister,
        beforeEnter: function (to, from, next) {
          // 인증 값 검증 로직 추가
          console.log("비포엔터", to, from);
    
          console.log('sessionStorage', sessionStorage.getItem('previousPage'));
    
          if (localStorage.getItem("accessToken") === null) {
            next({ path: "/login" });
          } else {
            next();
          }
        },
      },
      {
        path: "my",
        component: MyPageView,
      },
      {
        path: "find/:type",
        component: ManagerFind,
        name: "find",
        props: true,
      },
      {
        path: "mypage/:id",
        component: ManagerMyContainer,
        props: true,
        children: [
          {
            path: "",
            component: ManagerMy,
            props: true,
          },
          {
            path: "voteList",
            component: ManagerMyVoteList,
            props: true,
          },
          {
            name: "voteDetail",
            path: "voteDetail",
            component: ManagerMyVoteDetail,
            props: true,
          },
        ],
      },
    ],
  },
  {
    path: "/user/:id",
    component: UserContainer,
    props: true,
    children: [
      {
        path: "",
        component: UserVoteList,
        props: true,
      },
      {
        path: "voteDetail",
        component: userVoteDetail,
        props: true,
      },
      {
        path: "vote",
        component: UserVote,
        props: true,
      },
      {
        path: "emailAuth",
        component: UserAuth,
        props: true,
      },
      {
        path: "voting",
        component: UserVoting,
        props: true,
      },
    ],
  },
  {
    path: "/admin",
    component: AdminContainer,
    children: [
      {
        path: "",
        component: AdminMain,
      },
      {
        path: ":id/voteDetail",
        component: AdminVoteDetail,
        props: true,
      },
    ],
    beforeEnter: function (to, from, next) {
      // 인증 값 검증 로직 추가
      console.log("비포엔터", to, from);

      if (sessionStorage.getItem('userR') !== 'admin') {
        next({ path: "/" });
      }
      console.log('sessionStorage', sessionStorage.getItem('previousPage'));

      if (localStorage.getItem("accessToken") === null) {
        next({ path: "/login" });
      } else {
        next();
      }
    },
  },
  {
    path: "/test",
    component: TestView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 네비게이션 가드에서 이전 페이지 URL 저장
router.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    // 로그인 페이지 이외의 페이지에서만 저장
    sessionStorage.setItem('previousPage', from.fullPath);
    // sessionStorage.setItem('previousPage', to.fullPath);
  }


  // admin 구별
  // 현재 로그인한 사용자 역할 확인 (예: sessionStorage에 저장된 역할)
  const userRole = sessionStorage.getItem('userR');

  // "/admin"과 관련된 URL에만 "admin" 역할을 가진 사용자 허용
  if (to.path.startsWith('/admin')) {
    if (userRole === 'admin') {
      next(); // 허용
    } else {
      next({ path: '/' }); // "admin"이 아닌 경우 홈페이지로 리다이렉트
    }
  } else {
    next(); // "/admin"이 아닌 URL은 허용
  }
  
  next();
});

export default router;
