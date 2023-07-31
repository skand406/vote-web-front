<template>
  <div>
    <div v-if="$route.params.type === 'id'">
      <h1>아이디 찾기</h1>
      <v-text-field label="이름" v-model="userNm"></v-text-field>
      <v-text-field label="이메일" v-model="userEmail"></v-text-field>
      <v-card
        v-show="!validate"
        text="이름과 이메일을 입력해주세요."
        variant="tonal"
      ></v-card>
    </div>
    <div v-else>
      <h1>비밀번호 찾기</h1>
      <v-text-field label="아이디" v-model="userId"></v-text-field>
      <v-text-field label="이메일" v-model="userEmail"></v-text-field>
      <v-card
        v-show="!validate"
        text="아이디와 이메일을 입력해주세요."
        variant="tonal"
      ></v-card>
    </div>
    <v-btn class="me-4" @click="onFind()" color="blue"> 인증하기 </v-btn>

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
      validate: true,
      data: "",
      popText: "",
    };
  },
  mounted() {},
  methods: {
    onFind() {
      console.log(this.$route.params.type);

      if (this.$route.params.type === "id") {
        if (this.userEmail === "" || this.userNm === "") {
          this.data = { user_id: this.userId }
          this.validate = false;
          return false;
        } else {
          this.data = { user_id: this.userId }
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
