<template>
  <div>
    <h1>투표 행사 페이지</h1>

    <h4>투표를 선택해주세요.</h4>
    <div
      v-for="(vote, index) in voteList"
      :key="index"
      @click="emailAuth(vote)"
    >
      {{ vote.vote_name }}
    </div>

    <CommonLoading />
  </div>
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading.vue";
//   import api from "@/utils/api";

export default {
  name: "VoteListView",
  props: ["id", "vote"],
  components: {
    CommonLoading,
  },
  data() {
    return {
      voteNm: "",
      voteId: "",
      voteList: [],
      candidateList: [],
    };
  },
  mounted() {
    this.loadVoteList();
    // this.loadCandidateList();
  },
  methods: {
    loadVoteList() {
      this.$store.commit("setLoadingState", true);

      this.axios
        .get(`/publices/vote/${this.id}`)
        .then((res) => {
          // console.log("res", res);

          this.voteList = res.data.map((item) => item);
          // console.log("this.voteList", this.voteList);
          this.$store.commit("setLoadingState", false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.$store.commit("setLoadingState", false);
        });
    },

    emailAuth(vote) {
      let voteId = vote.vote_id;
      this.$router.push({
        path: `/user/${voteId}/emailAuth`,
        props: { id: this.voteId, vote: vote },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
