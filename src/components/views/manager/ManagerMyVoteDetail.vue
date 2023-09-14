<template>
  <div>
    <h2>투표 상세 페이지</h2>

    <h4 v-if="formActivate" style="color: blue">
      투표가 시작되어 수정할 수 없습니다.
    </h4>

    <v-form ref="form" v-model="formValidate" :disabled="formActivate">
      <v-text-field
        v-model="voteNm"
        label="투표명"
        :rules="nmRules"
      ></v-text-field>

      <v-select
        :items="deptList"
        v-model="dept"
        label="대상 학과"
        :rules="deptRules"
        required
        disabled
      ></v-select>

      <v-select
        :items="gradeList"
        label="대상 학년"
        v-model="grade"
        :rules="gradeRules"
        required
        disabled
      ></v-select>

      <VueDatePicker
        v-model="date"
        locale="ko"
        range
        @update:model-value="handleDate"
        auto-apply
        placeholder="기간을 선택해주세요."
        :state="datePickerVal"
        :min-date="new Date()"
      ></VueDatePicker>
      <!-- :disabled="formActivate" -->

      <div v-if="!formActivate">
        <v-text-field
          v-model="searchVal"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <h4>학생 리스트</h4>
        <div style="height: 500px; overflow: auto">
          <div
            v-for="(student, index) in displayedStudentList"
            :key="index"
            @click="createCandidate(student)"
          >
            {{ student.student_major }} {{ student.student_grade }}학년
            {{ student.student_id }}
            {{ student.student_name }}
          </div>
        </div>
      </div>

      <h4>후보자 리스트</h4>
      <div v-for="(student, index) in candidateStudent" :key="index">
        <h5>후보자 {{ index + 1 }}</h5>
        {{ student.student.student_major }}
        {{ student.student.student_grade }}학년
        {{ student.candidate.candidate_id }}
        {{ student.student.student_name }}
        <span @click="deleteCandidate(student)">[삭제]</span>

        <v-text-field
          label="설명"
          v-model="student.candidate.candidate_spec"
        ></v-text-field>

        <v-text-field
          v-model="student.candidate.candidate_promise"
          label="공약"
        ></v-text-field>

        <v-file-input accept="image/*" @change="readFile(index)"></v-file-input>
        <v-img
          :width="100"
          aspect-ratio="1/1"
          cover
          :src="student.imgPath.src"
        ></v-img>
      </div>

      <v-btn
        type="button"
        class="me-4"
        color="blue"
        @click="modifyVote()"
        :disabled="formActivate"
      >
        투표 수정
      </v-btn>
    </v-form>
  </div>

  <CommonPopup :text="popText" />
  <CommonLoading />
</template>

<script>
import { ref } from "vue";

import CommonPopup from "@/components/views/common/CommonPopup.vue";
import CommonLoading from "@/components/views/common/CommonLoading.vue";
import api from "@/utils/api";

export default {
  name: "ManagerMyVoteDetail",
  props: ["id", "vote"],
  components: {
    CommonPopup,
    CommonLoading,
  },
  data() {
    return {
      voteList: [],
      candidateList: [],
      candidateStudent: [],
      studentList: [],
      delCandidateList: [],
      voteNm: "",
      major: "",
      grade: "",
      voteId: "",
      voteType: "",
      bundleId: "",
      date: ref,
      formActivate: true,
      searchVal: "",
      userId: "",
      popText: "",
      datePickerVal: false,
    };
  },
  mounted() {
    // this.$store.getters.getAdminVoteDetail === null
    if (sessionStorage.getItem('userR') === 'member') { // 멤버
      // date picker 세팅
      this.setDatePicker();

      this.loadVoteDetail();
      this.loadStundetList();
      this.userId = sessionStorage.getItem("user");
    } else { // 어드민
      this.$store.commit("setVoteDetail", this.$store.getters.getAdminVoteDetail);
      this.loadVoteDetail();
      this.loadStundetList();
      this.userId = sessionStorage.getItem("user");
    }
  },
  computed: {
    displayedStudentList: function () {
      if (this.searchVal === "") {
        return this.studentList;
      } else {
        const keyword = this.searchVal.toLowerCase();
        return this.studentList.filter((student) => {
          return (
            student.student_id.toString().includes(keyword) ||
            student.student_name.toLowerCase().includes(keyword)
          );
        });
      }
    },
  },
  methods: {
    // 학생 리스트 조회
    loadStundetList() {
      this.$store.commit("setLoadingState", true);

      api
        .get("/members/candidate/student")
        .then((res) => {
          this.studentList = res.data.map((item) => item);
          // console.log("$$$$this.student", this.studentList);
          this.$store.commit("setLoadingState", false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.$store.commit("setLoadingState", false);
        });
    },

    async loadVoteDetail() {
      // 투표 관련
      this.voteList = JSON.parse(this.$store.getters.getVoteDetail);
      // console.log("this.voteList", this.voteList);

      let {
        vote_name,
        vote_bundle_id,
        vote_type,
        major,
        grade,
        start_date,
        end_date,
        vote_id,
      } = this.voteList;
      this.voteNm = vote_name;
      this.voteId = vote_id;
      this.dept = major;
      this.grade = grade;
      this.date = [start_date, end_date];
      this.bundleId = vote_bundle_id;
      this.voteType = vote_type;

      // 시작날짜 이미 지났다면 투표 수정 불가
      const currentDate = new Date();

      // "yyyy-mm-dd" 형식의 문자열
      const dateStart = start_date;

      // 문자열을 "-"로 분리하여 배열로 만들기
      const dateParts = dateStart.split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // 월은 0부터 시작하므로 1을 빼줍니다.
      const day = parseInt(dateParts[2], 10);

      // Date 객체 생성
      const dateObject = new Date(year, month, day);

      console.log("ddfdf", currentDate <= dateObject);
      if (currentDate <= dateObject) {
        this.formActivate = false;
      } else {
        this.formActivate = true;
      }

      // 후보자 관련
      await this.axios
        .get(`/publices/candidate/${this.voteId}`)
        .then((res) => {
          console.log("res", res);

          this.candidateList = res.data.map((item) => item);
          console.log("this.candidateList", this.candidateList);
          // this.$store.commit("setLoadingState", false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.$store.commit("setLoadingState", false);
        });

      await Promise.all(
        this.candidateList.map(async (item) => {
          console.log("item", item.candidate_id);
          let candidateId = item.candidate_id;
          try {
            const res = await this.axios.get(
              `/publices/candidate/${this.voteId}/${candidateId}`
            );
            console.log("res", res);

            // 이미지 데이터 가져오기
            const imageRes = await this.axios.get(
              `/publices/candidate/img/${this.voteId}/${candidateId}`,
              {
                responseType: "arraybuffer", // 바이너리 데이터로 응답 받기 위해 responseType 설정
              }
            );

            // 이미지 데이터를 Base64 문자열로 변환
            const contentType = res.headers["content-type"];
            const blob = new Blob([imageRes.data], { type: contentType });
            this.candidateStudent.push({
              candidate: res.data.candidate,
              student: res.data.student,
              imgPath: {
                src: URL.createObjectURL(blob),
              },
            });
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        })
      );

      console.log("this.candidateStudent", this.candidateStudent);
    },

    deleteCandidate(candidate) {
      this.$store.commit("setLoadingState", true);

      const filteredCandidates = this.candidateList.filter(
        (element) => element.candidate_id == candidate.candidate.candidate_id
      );

      // 신규 후보 삭제 시 리스트만 삭제, 기존 후보 리스트 삭제
      this.candidateStudent = this.candidateStudent.filter(
        (element) =>
          element.candidate.candidate_id !== candidate.candidate.candidate_id
      );

      // 기존 후보 삭제 시 리스트 + 데이터 삭제
      if (filteredCandidates.length !== 0) {
        api
          .delete(
            `/members/candidate/${this.voteId}/${candidate.candidate.candidate_id}`
          )
          .then(() => {
            this.$store.commit("setLoadingState", false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            this.$store.commit("setLoadingState", false);
          });
      }
    },

    createCandidate(candidate) {
      let student = [];
      student.candidate = {
        candidate_id: candidate.student_id,
        candidate_spec: "",
        candidate_promise: "",
      };

      student.student = {
        student_id: candidate.student_id,
        student_name: candidate.student_name,
        student_major: candidate.student_major,
        student_grade: candidate.student_grade,
      };

      student.imgPath = {
        src: require("../../../assets/person.jpg"), // 기본 이미지
      };

      this.candidateStudent.push(student);

      console.log("this.candidateStudent", this.candidateStudent);
    },

    // 이미지 데이터 생성&미리보기
    readFile(index) {
      var input = event.target;
      console.log("input.files[0]", input.files[0]);
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          console.log("e", e);
          // 이미지 미리보기
          this.candidateStudent[index].imgPath.src = ref(e.target.result);
          this.candidateStudent[index].imgPath.file = input.files[0];
        };
        reader.readAsDataURL(input.files[0]);
      }
    },

    async modifyVote() {
      console.log("투표 수정");
      this.$store.commit("setLoadingState", true);
      console.log('this.voteId', this.voteId);
      console.log('this.userId', this.userId);

      try {
        // 투표 수정
        await api
          .put(`/members/vote/${this.voteId}`, {
            vote_id: this.voteId,
            vote_bundle_id: this.bundleId,
            start_date: this.date[0],
            end_date: this.date[1],
            vote_name: this.voteNm,
            vote_type: this.voteType,
            major: this.dept,
            user_id: this.userId,
          })
          .then((res) => {
            console.log("res", res);
          });

        // 기존 후보자 수정
        console.log("this.candidateList", this.candidateList);

        for (var i = 0; i < this.candidateList.length; i++) {
          const studentId = this.candidateStudent[i].student.student_id;
          await api
            .put(`/members/candidate/${this.voteId}/${studentId}`, {
              candidate_spec: this.candidateStudent[i].candidate.candidate_spec,
              candidate_promise:
                this.candidateStudent[i].candidate.candidate_promise,
            })
            .then((res) => {
              console.log("후보자 수정 res", res);
            });

          // 기존 후보 이미지 수정
          const formData = new FormData(); // 멀티파트 폼 데이터 생성

          // 파일 업로드를 위한 파일 객체 추가
          formData.append("image", this.candidateStudent[i].imgPath.file);
          await api
            .put(
              `/members/candidate/img/${this.voteId}/${studentId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data", // 멀티파트로 설정
                },
              }
            )
            .then((res) => {
              console.log("이미지 수정 res", res);
            });
        }
        console.log("AA");
        const formData2 = new FormData(); // 멀티파트 폼 데이터 생성
        formData2.append("vote_id", this.candidateStudent[0].candidate.vote_id);

        // 새 후보자 추가
        console.log("새 후보자 추가", i, this.candidateStudent.length);
        console.log("this.candidateStudent", this.candidateStudent);
        const cData = [];

        for (
          let i = this.candidateList.length;
          i < this.candidateStudent.length;
          i++
        ) {
          const candidate = {
            candidate_id: this.candidateStudent[i].candidate.candidate_id,
            candidate_spec: this.candidateStudent[i].candidate.candidate_spec,
            candidate_promise:
              this.candidateStudent[i].candidate.candidate_promise,
            vote_id: this.candidateStudent[0].candidate.vote_id,
          };
          cData.push(candidate);

          // 새 후보자 이미지 추가
          // 파일 업로드를 위한 파일 객체 추가
          formData2.append(
            "candidate_id",
            this.candidateStudent[i].candidate.candidate_id
          );

          formData2.append("img", this.candidateStudent[i].imgPath.file);

          await api
            .post("/members/candidate/img/upload", formData2, {
              headers: {
                "Content-Type": "multipart/form-data", // 멀티파트로 설정
              },
            })
            .then((res) => {
              console.log("새 후보자 이미지 추가 res", res);
            });
        }

        await api.post("/members/candidate/register", cData).then((res) => {
          console.log("새 후보자 추가 res", res);
        });

        this.$store.commit("setLoadingState", false);
      } catch (error) {
        console.log("투표 수정 에러", error);
        this.$store.commit("setLoadingState", false);
      }
    },

    // date picker 초기화
    setDatePicker() {
      const startDate = new Date();
      const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
      this.date.value = [startDate, endDate];
    },

    // datepicker 관련
    handleDate(modelData) {
      console.log("modelData", modelData);
      this.datePickerVal = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
