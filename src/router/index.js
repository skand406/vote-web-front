import { createWebHistory, createRouter } from "vue-router";
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
import AdminMain from "@/components/views/admin/AdminMain";
import AdminLogin from "@/components/views/admin/AdminLogin";


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
        // beforeEnter: function (to, from, next) {
        //   // 인증 값 검증 로직 추가
        //   console.log("비포엔터", to, from);

        //   if (localStorage.getItem("token") === null) {
        //     next({ path: "/login" });
        //   } else {
        //     next();
        //   }
        // },
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
            // props: (route) => ({
            //   id: route.params.id, // 동적 파라미터로부터 id를 받아옴
            //   vote: route.query.vote, // query 파라미터로부터 vote를 받아옴
            // }),
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
    component: AdminLogin,
    children: [
      {
        path: "mail",
        component: AdminMain,
      }
    ],
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

export default router;
