<template>
  <div>
    <h1>유저 루트</h1>

    <router-view />
    
    <router-link :to="`/user/${id}/vote`" v-if="!isVoteRoute">투표하러 가기</router-link>
  </div>
</template>

<script>
// import CommonPopup from '@/components/views/common/CommonPopup.vue'
// import CommonLoading from '@/components/views/common/CommonLoading.vue'

export default {
  name: "UserContainer",
  props: ["id"],
  components: {
    // CommonPopup,
    // CommonLoading
  },
  mounted() {},
  computed: {
    isVoteRoute() {
      // 현재 라우터 경로가 특정 URL인지 확인

      const currentPath = this.$route.fullPath;
      return currentPath === `/user/${this.id}/vote` || currentPath === `/user/${this.id}/emailAuth` || currentPath === `/user/${this.id}/voting`;
    },
  },
  methods: {
    openPopup() {
      this.$store.commit("setPopState", true);
    },

    openLoading() {
      this.$store.commit("setLoadingState", true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
