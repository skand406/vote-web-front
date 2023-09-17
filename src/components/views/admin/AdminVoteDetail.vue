<template>
  <div>
    <h2>투표 수정</h2>
    <UpdateVote />
  </div>
</template>

<script>
// import CommonPopup from '@/components/views/common/CommonPopup.vue'
// import CommonLoading from '@/components/views/common/CommonLoading.vue'
import UpdateVote from '@/components/views/manager/ManagerMyVoteDetail.vue'

export default {
  name: "AdminVoteDetail",
  props: ["id"],
  data () {
    return {
      vote: []
    }
  },
  components: {
    // CommonPopup,
    // CommonLoading
    UpdateVote
  },
  mounted() {
  },
  methods: {
    loadVoteDetail() {
      this.vote = this.$store.getters.getAdminVoteDetail;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
