<template>
  <div>
    <h2>투표 리스트</h2>

    <div v-for="(vote, index) in voteList" :key="index">
      <span @click="voteDetail(vote)">
        {{ index + 1 }} {{ vote.vote_name }} {{ vote.start_date }}
        {{ vote.end_date }}
      </span>
      &nbsp;
      
      <span><v-btn @click="sendUrl(vote)" :disabled="btnYn[index]">URL 발송</v-btn></span> &nbsp;
      <span @click="resultVote(vote)">[투표 결과 보기]</span>
    </div>
  </div>
  <CommonPopup :text="popText" />
  <CommonLoading />
</template>

<script>
import CommonPopup from "@/components/views/common/CommonPopup.vue";
import CommonLoading from "@/components/views/common/CommonLoading.vue";
import api from "@/utils/api";

export default {
  name: "ManagerMyVoteList",
  props: ["id"],
  components: {
    CommonPopup,
    CommonLoading,
  },
  data() {
    return {
      voteList: [],
      popText: "",
      btnYn: []
    };
  },
  created() { // 마크업 전 실행
    this.loadVoteList();
  },
  mounted() {
  },
  methods: {
    loadVoteList() {
      api
        .get(`/members/vote/${this.id}`, this.candidateList)
        .then((res) => {
          // console.log("res", res);
          this.voteList = res.data.map((item) => item);

          // 초기에 모든 버튼을 활성화
          this.btnYn = this.voteList.map(() => false);
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
      // console.log("vote", vote);

      this.$store.commit("setVoteDetail", JSON.stringify(vote));

      this.$router.push({
        path: `/mypage/${this.id}/voteDetail`,
        props: { id: this.id },
      });
    },

    sendUrl(vote) {
      // console.log("url 보내기", vote);

      const { vote_bundle_id } = vote;

      api
        .get(`/members/message/URL/${vote_bundle_id}`, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // console.log("res", res);
          if (res.status === 200) {
            // 필터링에 따라 버튼 상태 업데이트
            this.btnYn = this.voteList.map((v, index) => {
              return v.vote_bundle_id === vote.vote_bundle_id ? true : this.btnYn[index];
            });
          }
        })
        .catch(function (error) {
          // 오류발생시 실행
          console.log("$$$$$$$$$$$$$$error", error);
        });
    },

    resultVote(vote) {
      // console.log("투표 결과 보기", vote);

      this.$store.commit("setVoteDetail", JSON.stringify(vote));

      this.$router.push({
        path: `/mypage/${this.id}/voteResult`,
        props: { id: this.id },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
