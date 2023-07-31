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
      data: "",
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
        if (this.userEmail === "" || this.userNm === "") {
          this.data = { user_id: this.userId };
          this.validate = false;
          return false;
        } else {
          this.data = { user_id: this.userId };
          this.validate = true;
        }
      } else {
        if (this.userId === "" || this.userEmail === "") {
          this.validate = false;
          return false;
        } else {
          this.validate = true;
        }
      }

      this.$store.commit("setLoadingState", true);

      this.axios
        .get("/users", this.data)
        .then((res) => {
          console.log("res", res);

          if (res.data === "ok") {
            // 팝업 띄우기
            if (this.$route.params.type === "id") {
              this.popText = "아이디는 입니다.";
            } else {
              this.popText = "이메일로 임시 비밀번호를 확인해주세요.";
            }
            this.$store.commit("setPopState", true);
          }
        })
        .catch((error) => {
          // 오류 발생 시 실행
          console.log("error", error);
        })
        .then(() => {
          // 항상 실행되는 부분
          this.$store.commit("setLoadingState", false);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
