<template>
  <div>
    <h1>로그인 페이지</h1>
    <form style="width: 500px">
      <v-text-field label="아이디" v-model="userId"></v-text-field>
      <v-text-field
        label="비밀번호"
        type="password"
        v-model="userPw"
      ></v-text-field>
      <v-btn class="me-4" @click="onLogin()" color="blue"> 로그인 </v-btn>
      <v-card
        v-show="!validate"
        text="아이디와 비밀번호를 입력해주세요."
        variant="tonal"
      ></v-card>
    </form>

    <router-link :to="{ name: 'find', params: { type: 'id' } }"
      >아이디 찾기</router-link
    >
    <router-link :to="{ name: 'find', params: { type: 'pw' } }"
      >비밀번호 찾기</router-link
    >

    <CommonLoading />
  </div>
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading.vue";

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
      validate: true,
    };
  },
  mounted() {},
  methods: {
    onLogin() {
      console.log("userId", this.userId);
      console.log("userPw", this.userPw);

      // if (this.userId === "" || this.userPw === "") {
      //   this.validate = false;
      //   return false;
      // } else {
      //   this.validate = true;
      // }

      this.$store.commit("setLoadingState", true);

      this.axios
        .post("/auth/login", {
          user_id: "apesgo",
          user_password: "1234",
        })
        .then((res) => {
          // response
          console.log("res", res);
          this.$store.commit("setLoginYnState", true);
          // 토큰 값 받으면 다시 header에 붙여서 보내기(추후!!)
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
