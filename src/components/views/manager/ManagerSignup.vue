<template>
  <div>
    <h1>회원가입 페이지</h1>

    <div class="align-center" style="width: 500px">
      <v-form ref="form" @submit.prevent="onLogin()" lazy-validation>
        <v-text-field
          v-model="userNm"
          label="담당자명"
          :rules="user_nm_rule"
        ></v-text-field>
        <div class="d-flex align-center">
          <v-text-field
            v-model="userNum"
            label="연락처"
            @keyup="phoneNumber(userNum)"
            maxlength="11"
            :rules="user_num_rule"
          ></v-text-field>
          <!-- <v-btn class="me-4"> 중복 확인 </v-btn> -->
        </div>

        <!-- <div class="d-flex align-center">
          <v-text-field
            v-model="userEmail"
            label="이메일"
            :rules="user_email_rule"
          ></v-text-field>
          <v-btn class="me-4" @click="sendEmail()"> 인증 발송 </v-btn>
        </div> -->

        <div class="d-flex align-center">
          <v-text-field
            v-model="userEmailAuth"
            label="이메일 인증번호"
            :rules="user_auth_rule"
          ></v-text-field>
          <v-btn class="me-4"> 인증 하기 </v-btn>
        </div>

        <div class="d-flex align-center">
          <v-text-field
            v-model="userId"
            label="아이디"
            :rules="user_id_rule"
          ></v-text-field>
          <v-btn class="me-4" @click="duplicateId()"> 중복 확인 </v-btn>
        </div>

        <!-- <v-text-field
          label="비밀번호"
          v-model="userPw"
          type="password"
          :rules="user_pw_rule"
        ></v-text-field> -->
        <!-- :type="visible ? 'text' : 'password'" -->

        <v-text-field
          label="비밀번호 확인"
          v-model="userRePw"
          type="password"
          @keyup="matchPw(userRePw)"
        ></v-text-field>

        <v-card
          v-show="!pwMatch"
          text="비밀번호가 일치하지 않습니다."
          variant="tonal"
        ></v-card>

        <v-btn class="me-4" @click="onSubmit()" color="blue"> 가입 완료 </v-btn>
      </v-form>

      <v-form ref="form" @submit.prevent="onLogin">
        <v-text-field
          v-model="userEmail"
          label="이메일"
          required
          :rules="user_id_rule"
        />
        <v-text-field
          v-model="userPw"
          :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
          :type="passwordShow ? 'text' : 'password'"
          label="비밀번호"
          :rules="user_pw_rule"
          counter
          @click:append="passwordShow = !passwordShow"
        />
        <!-- <v-checkbox v-model="autoLoginCheckBox" :label="'자동 로그인'" /> -->
        <v-btn id="login_btn" @click="onLogin" @keyup.enter="onLogin">
          로그인
        </v-btn>
      </v-form>
    </div>
  </div>
  <CommonPopup :text="popText" />
  <CommonLoading />
</template>

<script>
import CommonPopup from "@/components/views/common/CommonPopup.vue";
import CommonLoading from "@/components/views/common/CommonLoading.vue";

export default {
  name: "SignupView",
  props: {},
  components: {
    CommonPopup,
    CommonLoading,
  },
  data() {
    return {
      userNm: "",
      userNum: "",
      userEmail: "",
      userEmailAuth: "",
      userId: "",
      userPw: "",
      userRePw: "",
      pwMatch: true,
      popText: "",
      user_id_rule: [
        (v) => !!v || "아이디를 입력해주세요.",
        (v) =>
          /^[a-zA-Z0-9]*$/.test(v) || "아이디는 영문+숫자만 입력 가능합니다.",
        (v) =>
          !(v && v.length >= 15) || "아이디는 15자 이상 입력할 수 없습니다.",
      ],
      user_nm_rule: [
        (v) => !!v || "이름을 입력해주세요.",
        (v) => !(v && v.length >= 30) || "이름은 30자 이상 입력할 수 없습니다.",
        (v) =>
          !/[~!@#$%^&*()_+|<>?:{}]/.test(v) ||
          "이름에는 특수문자를 사용할 수 없습니다.",
      ],
      user_pw_rule: [
        (v) =>
          this.state === "ins" ? !!v || "비밀번호를 입력해주세요." : true,
        (v) =>
          !(v && v.length >= 30) || "비밀번호는 30자 이상 입력할 수 없습니다.",
      ],
      user_repw_rule: [
        (v) =>
          this.state === "ins"
            ? !!v || "패스워드는 필수 입력사항입니다."
            : true,
        (v) =>
          !(v && v.length >= 30) || "패스워드는 30자 이상 입력할 수 없습니다.",
        (v) => v === this.user_pw || "패스워드가 일치하지 않습니다.",
      ],
    };
  },
  mounted() {},
  methods: {
    onSubmit() {
      console.log(
        this.userNm,
        this.userNum,
        this.userEmail,
        this.userId,
        this.userPw,
        this.userRePw
      );

      this.$store.commit("setLoadingState", true);

      // 입력값 검증
      const validate = this.$refs.form.validate();
      console.log("validate", validate);

      if (!validate) {
        this.$store.commit("setLoadingState", false);
        return false;
      } else {
        this.axios
          .post("/auth/signup", {
            user_name: this.userNm,
            user_tel: this.userNum,
            user_email: this.userEmail,
            user_id: this.userId,
            user_password: this.userPw,
          })
          .then((res) => {
            // response
            console.log("res", res);
            this.$store.commit("setLoadingState", false);

            this.popText = "가입이 완료되었습니다. 메인으로 이동합니다.";
            this.$store.commit("setPopState", true);
          })
          .catch(function (error) {
            // 오류발생시 실행
            console.log("error", error);
          })
          .then(() => {
            // always executed
            this.$store.commit("setLoadingState", false);
          });
      }
    },

    matchPw(rePw) {
      if (this.userPw !== rePw) {
        this.pwMatch = false;
      } else {
        this.pwMatch = true;
      }
    },

    phoneNumber(val) {
      console.log("value", val);
      // console.log('xx', value.replace(/[^0-9]/, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
    },

    sendEmail() {
      console.log("이메일 발송");
      this.popText = "이메일을 발송하였습니다. 이메일을 확인해주세요.";
      this.$store.commit("setPopState", true);
    },

    duplicateId() {
      this.axios
        .get("/users/id")
        .then((res) => {
          console.log("res", res);

          if (res.data === "ok") {
            // 팝업 띄우기
            this.popText = "사용할 수 있는 아이디입니다.";
          } else {
            this.popText = "사용할 수 없는 아이디입니다.";
            this.userId = "";
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

      // 아이디 중복 체크 로직 추가 필요
      this.popText = "아이디 중복입니다.";
      this.$store.commit("setPopState", true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
