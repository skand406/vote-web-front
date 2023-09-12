<template>
  <div>
    <h2>투표 리스트</h2>

    <div
      v-for="(vote, index) in voteList"
      :key="index"
      @click="voteDetail(vote)"
    >
      {{ index+1 }} {{ vote.vote_name }} {{ vote.start_date }} {{ vote.end_date }}
    </div>
  </div>
</template>

<script>
// import CommonPopup from '@/components/views/common/CommonPopup.vue'
// import CommonLoading from '@/components/views/common/CommonLoading.vue'
import api from "@/utils/api";

export default {
  name: "ManagerMyVoteList",
  props: ["id"],
  components: {
    // CommonPopup,
    // CommonLoading
  },
  data() {
    return {
      voteList: [],
    };
  },
  mounted() {
    this.loadVoteList();
  },
  methods: {
    loadVoteList() {
      api
        .get(`/members/vote/${this.id}`, this.candidateList)
        .then((res) => {
          console.log("res", res);
          this.voteList = res.data.map((item) => item);
        })
        .catch(function (error) {
          // 오류발생시 실행
          console.log("error", error);
        })
        .then(() => {
          // always executed
        });
    },

    voteDetail(vote) {
      console.log('vote', vote);

      this.$store.commit("setVoteDetail", JSON.stringify(vote));

      this.$router.push({
        path: `/mypage/${this.id}/voteDetail`,
        props: { id: this.id },
      });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
