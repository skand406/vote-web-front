<template>
  <div
    style="width: 300px; height: calc(100vh - 48px); border: 1px solid black"
  >
    <h2>메뉴</h2>
    <ul>
      <li>
        <router-link to="/admin">투표 수정</router-link>
      </li>
      <li>
        <router-link to="/admin">유저 수정</router-link>
      </li>
      <li @click="onLogout()">
        로그아웃
      </li>
    </ul>
  </div>
</template>

<script>
// import CommonPopup from '@/components/views/common/CommonPopup.vue'
// import CommonLoading from '@/components/views/common/CommonLoading.vue'
import api from "@/utils/api";

export default {
  name: "AdminMenu",
  components: {
    // CommonPopup,
    // CommonLoading
  },
  mounted() {},
  methods: {
    onLogout() {
      this.$store.commit("setLoadingState", true);
      const refreshToken = localStorage.getItem("refreshToken") 

      api
        .post("/auths/logout", { refreshToken: refreshToken })
        .then(() => {
          // console.log("res", res);

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          this.emitter.emit("loginStateChanged", false);
          this.$store.commit("setLoadingState", false);
          sessionStorage.removeItem("user")
          sessionStorage.removeItem("userR")

          // 메인으로 이동
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
