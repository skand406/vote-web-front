<template>
  <div>
    <h1>투표 행사</h1>

    <div v-if="voteType === 'ITEM'">
      <v-radio-group v-model="voteValue" multiple="true">
        <div v-for="(candidate, index) in candidateList" :key="index">
          <v-radio
            :label="'후보 ' + (index + 1) + ' ' + candidate.candidate_spec"
            :value="candidate.candidate_id"
            :name="index + 1"
          ></v-radio>

          <div>
            <img
              :src="candidate.imgSrc"
              alt="Received Image"
              style="width: 100px"
            />
          </div>
        </div>
      </v-radio-group>
    </div>
    <div v-else>
      <v-radio-group v-model="voteValue">
        <div v-for="(candidate, index) in candidateList" :key="index">
          <v-radio
            :label="'후보 ' + (index + 1) + ' ' + candidate.candidate_spec"
            :value="candidate.candidate_id"
            :name="single"
          ></v-radio>

          <div v-if="!voteType === 'MONO'">
            <img
              :src="candidate.imgSrc"
              alt="Received Image"
              style="width: 100px"
            />
          </div>
        </div>
      </v-radio-group>
    </div>

    <v-btn type="button" class="me-4" color="blue" @click="voting()">
      투표 하기
    </v-btn>

    <CommonPopup :text="popText" />
    <CommonLoading />
  </div>
</template>

<script>
import CommonPopup from "@/components/views/common/CommonPopup.vue";
import CommonLoading from "@/components/views/common/CommonLoading.vue";
//   import api from "@/utils/api";

export default {
  name: "VoteListView",
  props: ["id", "vote"],
  components: {
    CommonPopup,
    CommonLoading,
  },
  data() {
    return {
      voteNm: "",
      voteId: "",
      voteType: "",
      voteList: [],
      candidateList: [],
      popText: "",
      voteValue: [],

      // form 관련
      studentId: "",
      userEmail: "",
      userEmailCode: "",
      userEmailYn: false,
      isEmail: false,
    };
  },
  mounted() {
    this.studentId = sessionStorage.getItem("electorUser");
    this.loadCandidateList();
  },
  methods: {
    async loadCandidateList() {
      this.$store.commit("setLoadingState", true);

      // 투표 정보
      const res = sessionStorage.getItem("candidate");
      // console.log('res', res);

      const {
        vote_name,
        major,
        grade,
        vote_bundle_id,
        start_date,
        end_date,
        vote_id,
        vote_type, // eslint-disable-line no-unused-vars
      } = JSON.parse(res);

      this.voteId = vote_id;
      this.voteNm = vote_name;
      this.voteType = vote_type;
      this.voteMajor = major;
      this.voteGrade = grade;
      this.stDt = start_date;
      this.enDt = end_date;
      this.bundleId = vote_bundle_id;

      // 후보자 리스트
      await this.axios
        .get(`/publices/candidate/${this.voteId}`)
        .then((res) => {
          //   console.log("res", res);

          this.candidateList = res.data.map((item) => item);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.$store.commit("setLoadingState", false);
        });

      // 이미지 조회
      if (!this.voteType === "MONO") {
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
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              this.$store.commit("setLoadingState", false);
            });
        }
      }
      this.$store.commit("setLoadingState", false);
    },

    voting() {
      this.$store.commit("setLoadingState", true);
      const data = {
        candidate_id: [this.voteValue],
        student_id: [this.studentId],
      };

      this.axios
        .put(`/publices/vote/${this.voteId}`, data)
        .then((res) => {
          // console.log("res", res);

          if (res.data === "") {
            this.$router.push({
              path: `/user/${this.bundleId}`, // bundle_id
              props: { id: this.bundleId },
            });
          } else {
            this.popText = "인증코드가 맞지 않습니다.";
            this.$store.commit("setPopState", true);
            this.$store.commit("setLoadingState", false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.$store.commit("setLoadingState", false);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
