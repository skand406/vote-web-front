<template>
  <div>
    <h1>투표 조회 페이지</h1>

    <div
      v-for="(vote, index) in voteList"
      :key="index"
      @click="candidateInfo(vote)"
    >
      {{ vote.vote_name }}
    </div>

    <CommonLoading />
  </div>
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading.vue";
// import api from "@/utils/api";

export default {
  name: "VoteListView",
  props: ["id"],
  components: {
    CommonLoading,
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
      this.$store.commit("setLoadingState", true);

      this.axios
        .get(`/publices/vote/${this.id}`)
        .then((res) => {
          // console.log("res", res);

          this.voteList = res.data.map((item) => item);
          this.$store.commit("setLoadingState", false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.$store.commit("setLoadingState", false);
        });
    },

    candidateInfo(vote) {
      // console.log("vote", vote);

      this.$router.push({
        path: `/user/${this.id}/voteDetail`,
        props: { id: this.id, vote: vote },
      });

      sessionStorage.setItem("candidate", JSON.stringify(vote))
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
