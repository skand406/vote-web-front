<template>
  <div>
    <h2>마이페이지</h2>

    <div class="align-center" style="width: 500px">
      <v-form
        ref="form"
        v-model="formValidate"
        @submit.prevent="onSubmit"
        lazy-validation
      >
        <v-text-field
          v-model="userNm"
          label="담당자명"
          :rules="nmRules"
          disabled
        ></v-text-field>
        <div class="d-flex align-center">
          <v-text-field
            v-model="userNum"
            label="연락처"
            maxlength="11"
            :rules="numRules"
          ></v-text-field>
          <!-- <v-btn class="me-4"> 중복 확인 </v-btn> -->
        </div>

        <div class="d-flex align-center">
          <v-text-field
            v-model="userEmail"
            label="이메일"
            :rules="emailRules"
          ></v-text-field>
          <v-btn class="me-4" @click="sendEmail()" :disabled="!isEmail">
            인증 발송
          </v-btn>
        </div>

        <div v-show="userEmailYn" class="d-flex align-center">
          <v-text-field
            v-model="userEmailAuth"
            label="이메일 인증번호"
            :rules="emailAuthRules"
          ></v-text-field>
          <v-btn class="me-4" @click="authEmail()" :disabled="!isAuthEmail">
            인증 하기
          </v-btn>
        </div>

        <div class="d-flex align-center">
          <v-text-field
            v-model="userId"
            label="아이디"
            :rules="idRules"
            disabled
          ></v-text-field>
        </div>

        <v-text-field
          label="비밀번호"
          v-model="userPw"
          type="password"
          :rules="pwRules"
        ></v-text-field>
        <!-- :type="visible ? 'text' : 'password'" -->

        <v-text-field
          label="비밀번호 확인"
          v-model="userRePw"
          type="password"
          :rules="repwRules"
        ></v-text-field>

        <v-btn type="submit" class="me-4" color="blue"> 회원정보 수정 </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";

export default {
  name: "MyPageView",
  props: ['id'],
  data() {
    return {
      userId: "",
      userNm: "",
      userNum: "",
      userEmail: "",
      userEmailAuth: "",
      userPw: "",
      userRePw: "",
      isEmail: false,
      isAuthEmail: false,

      formValidate: true,
      numRules: [
        (v) => !!v || "연락처를 입력해주세요.",
        (v) => {
          const regex = /^(\d{2,3})(\d{3,4})(\d{4})$/;
          if (regex.test(v)) return true;
          return "연락처를(숫자만 입력) 확인해주세요.";
        },
      ],
      idRules: [
        (v) => !!v || "아이디를 입력해주세요.",
        (v) =>
          /^[a-zA-Z0-9]*$/.test(v) || "아이디는 영문+숫자만 입력 가능합니다.",
        (v) =>
          !(v && v.length >= 15) || "아이디는 15자 이상 입력할 수 없습니다.",
      ],
      nmRules: [
        (v) => !!v || "이름을 입력해주세요.",
        (v) => !(v && v.length >= 30) || "이름은 30자 이상 입력할 수 없습니다.",
        (v) =>
          !/[~!@#$%^&*()_+|<>?:{}]/.test(v) ||
          "이름에는 특수문자를 사용할 수 없습니다.",
      ],
      pwRules: [
        (v) => !!v || "비밀번호를 입력해주세요.",
        (v) => {
          const regex =
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
          if (regex.test(v) === true) return true;
          return "특수문자와 문자, 숫자를 포함하여 8자 이상 입력해주세요.";
        },
      ],
      repwRules: [
        (v) => !!v || "비밀번호를 입력해주세요.",
        (v) => v === this.userPw || "비밀번호가 일치하지 않습니다.",
      ],
      emailRules: [
        (v) => !!v || "이메일을 입력해주세요.",
        (v) => {
          const replaceV = v.replace(/(\s*)/g, "");
          const pattern =
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
          if (pattern.test(replaceV)) return (this.isEmail = true);
          return "이메일 형식으로 입력해주세요";
        },
      ],
      emailAuthRules: [
        (value) => {
          if (value) return (this.isAuthEmail = true);

          return "인증번호를 입력해주세요.";
        },
      ],
    };
  },
  components: {},
  mounted() {
    // console.log("userId", sessionStorage.getItem("user"));
    this.loadUserInfo();
  },
  methods: {
    async loadUserInfo() {
      this.userId = await this.id;

      await api
        .get(`/members/user/${this.userId}`, {
          user_id: this.userId,
        })
        .then((res) => {
          // console.log("res", res);

          const { user_name, user_email, user_tel } = res.data;

          this.userNm = user_name;
          this.userEmail = user_email;
          this.userNum = user_tel;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },

    sendEmail() {
      // console.log("이메일 발송");
      this.$store.commit("setLoadingState", true);

      this.axios
        .post("/auths/email-checker", {
          user_email: this.userEmail,
        })
        .then((res) => {
          // console.log("res", res);

          if (res.data === "이미 가입된 이메일입니다.") {
            this.popText = res.data;
            this.userEmail = "";
          } else {
            this.popText = "이메일을 발송하였습니다. 이메일을 확인해주세요.";
            this.userEmailYn = true;
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

      this.$store.commit("setPopState", true);
    },

    authEmail() {
      // console.log("인증번호 확인", this.userEmailAuth);

      this.axios
        .post("/auths/email", {
          code: this.userEmailAuth,
        })
        .then((res) => {
          // console.log("res", res);

          if (res.data === "인증에 실패했습니다.") {
            this.popText = res.data;
            this.userEmailAuth = "";
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
    },

    onSubmit() {
      // console.log('this.userNum', this.userNum);
      // 입력값 검증
      if (!this.formValidate || !this.userEmailYn) {
        this.$store.commit("setLoadingState", false);
        this.popText = "입력폼을 확인해주세요.";
        this.$store.commit("setPopState", true);
        return false;
      } else {
        api
          .put(`/members/personal/user/${this.userId}`, {
            user_id: this.userId,
            user_name: this.userNm,
            user_tel: this.userNum,
            user_email: this.userEmail,
            user_password: this.userPw,
            role: "member", // 대부분 member
          })
          .then(() => {
            // console.log("res", res);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
