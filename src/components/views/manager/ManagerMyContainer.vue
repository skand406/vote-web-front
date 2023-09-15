<template>
  <div>
    <h1>마이페이지 루트</h1>

    <router-link :to="`/mypage/${id}`">개인정보 수정</router-link> &nbsp;
    <router-link :to="`/mypage/${id}/voteList`">투표 조회&수정</router-link>
    <li @click="onSignout()">계정 탈퇴</li>
    <router-view />
  </div>
</template>

<script>
// import CommonPopup from '@/components/views/common/CommonPopup.vue'
// import CommonLoading from '@/components/views/common/CommonLoading.vue'
import api from "@/utils/api";

export default {
  name: "ManagerMyContainer",
  props: ["id"],
  components: {
    // CommonPopup,
    // CommonLoading
  },
  mounted() {},
  methods: {
    onSignout() {
      console.log("계정 탈퇴");

      const userId = sessionStorage.getItem("user");

      var input = confirm(
        "계정 탈퇴 시 모든 데이터는 삭제 됩니다. 계정 탈퇴를 진행하시겠습니까?"
      );
      console.log("input", input);

      if (input) {
        api
          .delete(`/members/user/${userId}`)
          .then(() => {
            this.$store.commit("setLoadingState", false);

            // 세션, 로컬 데이터 삭제
            sessionStorage.clear();
            localStorage.clear();
            this.emitter.emit("loginStateChanged", false);

            alert("계정 탈퇴가 완료되었습니다.");
            this.$router.push("/");
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            this.$store.commit("setLoadingState", false);
          });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
