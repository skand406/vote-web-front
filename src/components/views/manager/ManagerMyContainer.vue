<template>
  <div>
    <h1>마이페이지 루트</h1>

    <router-link :to="`/mypage/${id}`">개인정보 수정</router-link> &nbsp;
    <router-link :to="`/mypage/${id}/voteList`">투표 조회&수정</router-link>
    <router-view />
  </div>
</template>

<script>
// import CommonPopup from '@/components/views/common/CommonPopup.vue'
// import CommonLoading from '@/components/views/common/CommonLoading.vue'

export default {
  name: "ManagerMyContainer",
  props: ["id"],
  components: {
    // CommonPopup,
    // CommonLoading
  },
  mounted() {},
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
