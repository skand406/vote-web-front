<template>
  <nav>
    <router-link to="/">로고</router-link>&nbsp;
    <div v-if="loginYn">
      <router-link :to="`/mypage/${this.userId}`">마이페이지</router-link>&nbsp;
      <!-- <router-link to="/vote">투표 등록</router-link>&nbsp; -->
      <div @click="onLogout()">로그아웃</div>
    </div>
    <div v-else>
      <router-link to="/login">로그인</router-link>&nbsp;
      <router-link to="/signup">회원가입</router-link>&nbsp;
    </div>
    <!-- <router-link to="/test">테스트창</router-link> -->
    <router-link to="/register">투표 등록</router-link>&nbsp;
  </nav>

  <CommonLoading />
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading.vue";
import api from "@/utils/api";
// import {EventBus} from "@/utils/EventBus";

export default {
  name: "headerView",
  props: {},
  components: {
    CommonLoading,
  },
  data() {
    return {
      loginYn: false,
      loginState: false,
      userId: ""
    };
  },
  created() {
    this.getLoginSession();

    // 로그인/로그아웃 네비게이션바 작동
    this.emitter.on("loginStateChanged", (state) => {
      // console.log("state", state);
      this.loginYn = state;
      this.userId = sessionStorage.getItem("user"); // userId 동기화
    });
  },
  mounted() {},
  methods: {
    // 로그인 여부 확인
    async getLoginSession() {
      this.userId = await sessionStorage.getItem("user");

      if (localStorage.getItem("accessToken") === null) {
        console.log("false");
        this.loginYn = false;
      } else {
        console.log("true");
        this.loginYn = true;
      }
    },

    onLogout() {
      this.$store.commit("setLoadingState", true);
      const refreshToken = localStorage.getItem("refreshToken") 

      api
        .post("/auths/logout", { refreshToken: refreshToken })
        .then((res) => {
          console.log("res", res);

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          this.emitter.emit("loginStateChanged", false);
          this.$store.commit("setLoadingState", false);
          sessionStorage.removeItem("user")
          sessionStorage.removeItem("userR")

          // 메인으로 이동
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
