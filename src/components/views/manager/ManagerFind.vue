<template>
  <div>
    <v-form v-model="formValidate" @submit.prevent="onFind">
      <div v-if="$route.params.type === 'id'">
        <h1>아이디 찾기</h1>
        <v-text-field
          label="이름"
          v-model="userNm"
          :rules="nmRules"
        ></v-text-field>
        <v-text-field
          label="이메일"
          v-model="userEmail"
          :rules="emailRules"
        ></v-text-field>
        <v-text-field
          v-model="userNum"
          label="연락처"
          maxlength="11"
          :rules="numRules"
        ></v-text-field>
      </div>
      <div v-else>
        <h1>비밀번호 찾기</h1>
        <v-text-field
          label="아이디"
          v-model="userId"
          :rules="idRules"
        ></v-text-field>
        <v-text-field
          label="이메일"
          v-model="userEmail"
          :rules="emailRules"
        ></v-text-field>
      </div>
      <v-btn type="submit" class="me-4" color="blue"> 인증하기 </v-btn>
    </v-form>

    <CommonPopup :text="popText" />
    <CommonLoading />
  </div>
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading.vue";
import CommonPopup from "@/components/views/common/CommonPopup.vue";

export default {
  name: "LoginView",
  props: {
    name: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
  },
  components: {
    CommonLoading,
    CommonPopup,
  },
  data() {
    return {
      userNm: "",
      userId: "",
      userPw: "",
      userEmail: "",
      userNum: "",
      data: "",
      url: "",
      popText: "",
      formValidate: true,
      idRules: [
        (value) => {
          if (value) return true;

          return "아이디를 입력해주세요.";
        },
      ],
      nmRules: [
        (value) => {
          if (value) return true;

          return "이름을 입력해주세요.";
        },
      ],
      emailRules: [
        (v) => !!v || "이메일을 입력해주세요.",
        (v) => {
          const replaceV = v.replace(/(\s*)/g, "");
          const pattern =
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
          return pattern.test(replaceV) || "이메일 형식으로 입력해주세요";
        },
      ],
      numRules: [
        (v) => !!v || "연락처를 입력해주세요.",
        (v) => {
          const regex = /^(\d{2,3})(\d{3,4})(\d{4})$/;
          if (regex.test(v)) return true;
          return "연락처를(숫자만 입력) 확인해주세요.";
        },
      ],
    };
  },
  mounted() {},
  methods: {
    onFind() {
      // console.log(this.$route.params.type);

      if (!this.formValidate) {
        return false;
      }

      if (this.$route.params.type === "id") {
        this.data = {
          user_email: this.userEmail,
          user_name: this.userNm,
          user_tel: this.userNum,
          user_id: null,
          user_password: null,
        };
        this.url = "/publices/user/id";

        this.axios
          .post(this.url, this.data)
          .then((res) => {
            // console.log("res", res);

            if (this.$route.params.type === "id") {
              if (res.data === "가입한적 없는 이메일입니다.") {
                this.popText = res.data;
              } else if (
                res.data ===
                "입력한 이메일이 저장된 이름과 전화번호가 일치하지 않습니다."
              ) {
                this.popText = res.data;
              } else {
                this.popText = "아이디는 " + res.data + "입니다.";
              }
            }

            this.$store.commit("setPopState", true);
          })
          .catch((error) => {
            // 오류 발생 시 실행
            console.log("error", error);
          })
          .then(() => {
            // 항상 실행되는 부분
            this.$store.commit("setLoadingState", false);
          });
      } else {
        this.data = {
          user_email: this.userEmail,
          user_id: this.userId,
        };
        this.url = "/publices/user/pw";

        this.axios
          .put(this.url, this.data)
          .then((res) => {
            // console.log("res", res);

            if (res.data === "임시 비밀번호가 발급되었습니다.") {
              this.popText = "이메일로 임시 비밀번호를 확인해주세요.";
            } else {
              this.popText = res.data;
            }

            this.$store.commit("setPopState", true);
          })
          .catch((error) => {
            // 오류 발생 시 실행
            console.log("error", error);
          })
          .then(() => {
            // 항상 실행되는 부분
            this.$store.commit("setLoadingState", false);
          });
      }

      this.$store.commit("setLoadingState", true);

      // this.axios
      //   .put(this.url, this.data)
      //   .then((res) => {
      //     // console.log("res", res);

      //     if (this.$route.params.type === "id") {
      //       if (res.data === "가입한적 없는 이메일입니다.") {
      //         this.popText = res.data;
      //       } else if (
      //         res.data ===
      //         "입력한 이메일이 저장된 이름과 전화번호가 일치하지 않습니다."
      //       ) {
      //         this.popText = res.data;
      //       } else {
      //         this.popText = "아이디는 " + res.data + "입니다.";
      //       }
      //     } else {
      //       if (res.data === "임시 비밀번호가 발급되었습니다.") {
      //         this.popText = "이메일로 임시 비밀번호를 확인해주세요.";
      //       } else {
      //         this.popText = res.data;
      //       }
      //     }

      //     this.$store.commit("setPopState", true);
      //   })
      //   .catch((error) => {
      //     // 오류 발생 시 실행
      //     console.log("error", error);
      //   })
      //   .then(() => {
      //     // 항상 실행되는 부분
      //     this.$store.commit("setLoadingState", false);
      //   });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
