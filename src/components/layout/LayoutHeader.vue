<template>
  <nav>
    <router-link to="/">로고</router-link>&nbsp;
    <div v-if="loginYn || this.$store.getters.getLoginYnState === true">
      <router-link to="/my">마이페이지</router-link>&nbsp;
      <div @click="onLogout()">로그아웃</div>
    </div>
    <div v-else>
      <router-link to="/login">로그인</router-link>&nbsp;
      <router-link to="/signup">회원가입</router-link>&nbsp;
    </div>
    <router-link to="/vote">투표 등록</router-link>&nbsp;
    <router-link to="/test">테스트창</router-link>
  </nav>

  <CommonLoading />
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading.vue";

export default {
  name: "headerView",
  props: {},
  components: {
    CommonLoading,
  },
  data() {
    return {
      loginYn: false,
    };
  },
  created() {
    this.getLoginSession();
  },
  mounted() {},
  methods: {
    // 로그인 여부 확인
    getLoginSession() {
      console.log("getLoginSession", sessionStorage.getItem("access"));
      if (
        sessionStorage.getItem("access") !== "" ||
        sessionStorage.getItem("access") !== null
      ) {
        this.loginYn = true;
      }
    },
    onLogout() {
      console.log("로그아웃");
      this.$store.commit("setLoadingState", true);

      this.axios
        .get("/auths/logout")
        .then((res) => {
          console.log("성공", res);
          if (res.data === "ok") {
            console.log('세션 제거', );
            // 로그인 세션 제거
            sessionStorage.clear();
            this.loginYn = false;
            this.$store.commit("setLoadingState", false);

            // 메인으로 이동
            this.$router.push({ path: "/" });
          }
        })
        .catch(function (error) {
          // 오류발생시 실행
          console.log("실패", error);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
