<template>
  <div>
    <h1>로그인 페이지</h1>
    <v-form
      v-model="formValidate"
      @submit.prevent="onLogin"
      style="width: 500px"
    >
      <v-text-field
        label="아이디"
        v-model="userId"
        :rules="idRules"
        required
      ></v-text-field>
      <v-text-field
        label="비밀번호"
        type="password"
        v-model="userPw"
        :rules="pwRules"
        required
      ></v-text-field>
      <v-btn type="submit" class="me-4" color="blue"> 로그인 </v-btn>
    </v-form>

    <router-link :to="{ name: 'find', params: { type: 'id' } }"
      >아이디 찾기</router-link
    >
    &nbsp;
    <router-link :to="{ name: 'find', params: { type: 'pw' } }"
      >비밀번호 찾기</router-link
    >

    <CommonLoading />
  </div>
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading.vue";
// import api from "@/utils/api";
// import {EventBus} from "@/utils/EventBus";

export default {
  name: "LoginView",
  props: {},
  components: {
    CommonLoading,
  },
  data() {
    return {
      userId: "",
      userPw: "",
      formValidate: true,
      idRules: [
        (value) => {
          if (value) return true;

          return "아이디를 입력해주세요.";
        },
      ],
      pwRules: [
        (value) => {
          if (value) return true;

          return "비밀번호를 입력해주세요.";
        },
      ],
    };
  },
  mounted() {},
  methods: {
    onLogin() {
      if (!this.formValidate) {
        return false;
      }

      this.$store.commit("setLoadingState", true);


      this.axios
        .post("/auths/login", {
          user_id: this.userId,
          user_password: this.userPw,
        }, { authRequired: false })
        .then((res) => {
          // console.log("res", res);

          let jsonData = JSON.stringify(res.data);
          const { accessToken, refreshToken } = JSON.parse(jsonData);

          sessionStorage.setItem("user", this.userId);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // console.log('로그인 accessToken', accessToken);
          // console.log('로그인 refreshToken', refreshToken);

          this.$store.commit("setLoadingState", false);

          // 로그인/로그아웃 네비게이션바 작동
          this.emitter.emit("loginStateChanged", true);

          // 메인으로 이동
          this.$router.push({ path: "/" });
        })
        .catch(function (error) {
          // 오류발생시 실행
          console.log("error", error);
        })
        .then(() => {
          // always executed
          this.$store.commit("setLoadingState", false);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
