<template>
  <div>
    <h1>로그인 페이지</h1>
    <v-form v-model="formValidate" @submit.prevent="onLogin" style="width: 500px">
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
      <v-btn type="submit" class="me-4"  color="blue"> 로그인 </v-btn>
      <!-- <v-card
        v-show="!validate"
        text="아이디와 비밀번호를 입력해주세요."
        variant="tonal"
      ></v-card> -->
    </v-form>

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
        return false
      }

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
