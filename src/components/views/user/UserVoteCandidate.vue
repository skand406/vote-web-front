<template>
  <div>
    <h4>투표 정보 확인</h4>
    <h5>투표명: {{ voteNm }}</h5>
    <h5>투표 기간: {{ stDt }} ~ {{ enDt }}</h5>

    <div v-for="(candidate, index) in candidateList" :key="index">
      후보 {{ index + 1 }}. {{ candidate.candidate_spec }} <br />

      <div v-if="voteType !== 'MONO'">
        <div>
          공약
          {{ candidate.candidate_promise }}
        </div>
        <div>
          <img
            :src="candidate.imgSrc"
            alt="Received Image"
            style="width: 100px"
          />
        </div>
      </div>
    </div>
    <CommonLoading />
  </div>
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading.vue";
//   import api from "@/utils/api";

export default {
  name: "VoteMenuView",
  props: ["id", "vote"],
  components: {
    CommonLoading,
  },
  data() {
    return {
      voteNm: "",
      voteId: "",
      candidateList: [],
    };
  },
  created() {},
  mounted() {
    this.loadCandidateList();
    console.log("voteType", this.voteType);
  },
  methods: {
    async loadCandidateList() {
      this.$store.commit("setLoadingState", true);

      // 투표 정보
      const res = sessionStorage.getItem("candidate");

      const {
        vote_name,
        major,
        grade,
        start_date,
        end_date,
        vote_id,
        vote_type, // eslint-disable-line no-unused-vars
      } = JSON.parse(res);

      this.voteId = vote_id;
      this.voteNm = vote_name;
      this.voteMajor = major;
      this.voteGrade = grade;
      this.stDt = start_date;
      this.enDt = end_date;
      this.voteType = vote_type;

      // 후보자 리스트
      await this.axios
        .get(`/publices/candidate/${this.voteId}`)
        .then((res) => {
          //   console.log("res", res);

          this.candidateList = res.data.map((item) => item);
          this.$store.commit("setLoadingState", false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.$store.commit("setLoadingState", false);
        });

      // 이미지 조회
      if (this.voteType !== "MONO") {
        for (var i = 0; i < this.candidateList.length; i++) {
          await this.axios
            .get(
              `/publices/candidate/img/${this.voteId}/${this.candidateList[i].candidate_id}`,
              {
                responseType: "arraybuffer", // 바이너리 데이터로 응답 받기 위해 responseType 설정
              }
            )
            .then((res) => {
              // console.log("res", res);

              const contentType = res.headers["content-type"]; // 응답 헤더의 content-type 가져옴
              const blob = new Blob([res.data], { type: contentType }); // 바이너리 데이터 -> Blob

              this.candidateList[i].imgSrc = URL.createObjectURL(blob); // Blob -> URL

              //   // this.$store.commit("setLoadingState", false);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              this.$store.commit("setLoadingState", false);
            });
        }
      }

      // console.log("this.candidateList", this.candidateList);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
