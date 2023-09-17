<template>
  <div>
    <h1>사용자 이메일 인증</h1>

    <v-form v-model="formValidate">
      <v-text-field
        label="학번"
        v-model="studentId"
        :rules="nmRules"
      ></v-text-field>
      <div class="d-flex align-center">
        <v-text-field
          v-model="userEmail"
          label="이메일"
          :rules="emailRules"
        ></v-text-field>
        <!-- :disabled="isEmail" -->
        <v-btn class="me-4" @click="sendEmail()"> 인증 발송 </v-btn>
      </div>

      <div v-show="userEmailYn" class="d-flex align-center">
        <v-text-field
          v-model="userEmailCode"
          label="이메일 인증번호"
          :rules="emailAuthRules"
        ></v-text-field>
        <!-- <v-btn class="me-4" @click="authEmail()"> 인증 하기 </v-btn> -->
      </div>

      <v-btn type="button" class="me-4" color="blue" @click="authEmail()">
        인증하기
      </v-btn>
    </v-form>

    <CommonPopup :text="popText" />
    <CommonLoading />
  </div>
</template>

<script>
import CommonPopup from "@/components/views/common/CommonPopup.vue";
import CommonLoading from "@/components/views/common/CommonLoading.vue";
//   import api from "@/utils/api";

export default {
  name: "VoteListView",
  props: ["id", "vote"],
  components: {
    CommonPopup,
    CommonLoading,
  },
  data() {
    return {
      voteNm: "",
      voteId: "",
      voteList: [],
      candidateList: [],
      popText: "",

      // form 관련
      studentId: "",
      userEmail: "",
      userEmailCode: "",
      userEmailYn: false,
      isEmail: false,
    };
  },
  mounted() {
  },
  methods: {
    sendEmail() {
      this.checkElector();
    },

    checkElector() {
      this.$store.commit("setLoadingState", true);

      return new Promise((resolve, reject) => {
        this.axios
          .post(
            `/auths/elector/${this.id}/${this.studentId}`,
            {
              vote_id: this.id,
              student_id: this.studentId,
              student_email: this.userEmail,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            if (res.data !== "전송완료") {
              this.popText = res.data;
              this.$store.commit("setPopState", true);
            }
            this.$store.commit("setLoadingState", false);

            resolve();
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            this.$store.commit("setLoadingState", false);

            reject(error);
          });
      });
    },

    authEmail() {
      this.$store.commit("setLoadingState", true);

      return new Promise((resolve, reject) => {
        this.axios
          .post(
            "/auths/email",
            {
              code: this.userEmailCode,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {

            if (res.status === 200) {
              sessionStorage.setItem("electorUser", this.studentId);

              this.$router.push({
                path: `/user/${this.id}/voting`,
                props: { id: this.id },
              });

              resolve();
            } else {
              this.popText = "인증코드가 맞지 않습니다.";
              this.$store.commit("setPopState", true);
              // reject(this.popText);
            }

            this.$store.commit("setLoadingState", false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            this.$store.commit("setLoadingState", false);
            reject(error);
          });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
