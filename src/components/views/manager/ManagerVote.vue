<template>
  <div>
    <h1>투표 등록 페이지</h1>

    <v-radio-group inline label="투표 종류" v-model="voteType">
      <v-radio label="인명투표" value="PEOPLE" @change="changeVote"></v-radio>
      <v-radio label="사물투표" value="ITEM" @change="changeVote"></v-radio>
      <v-radio label="찬반투표" value="MONO" @change="changeVote"></v-radio>
    </v-radio-group>

    <v-form ref="form" v-model="formValidate">
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
      ></v-select>

      <v-select
        :items="gradeList"
        label="대상 학년"
        v-model="grade"
        :rules="gradeRules"
        required
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

      <div v-if="voteType === 'PEOPLE'">
        <v-text-field
          v-model="searchVal"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <h4>학생 리스트</h4>
        <div style="height: 500px; overflow: auto">
          <!-- <div
            v-for="(student, index) in studentList"
            :key="index"
            @click="createCandidate(student)"
          >
            {{ student.student_major }} {{ student.student_grade }}학년
            {{ student.student_id }}
            {{ student.student_name }}
          </div> -->
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
        <h4>후보자 리스트</h4>
        <div style="height: 500px; overflow: auto">
          <div v-for="(student, index) in candidateList" :key="index">
            {{ student.student_major }} {{ student.student_grade }}학년
            {{ student.student_id }}
            {{ student.student_name }}
            <span @click="deleteCandidate(student)">[삭제]</span>

            <v-text-field
              label="설명"
              v-model="student.candidateSubmit.candidate_spec"
            ></v-text-field>

            <v-text-field
              v-model="student.candidateSubmit.candidate_promise"
              label="공약"
            ></v-text-field>

            <v-file-input
              accept="image/*"
              @change="readFile(index)"
            ></v-file-input>
            <v-img
              :width="100"
              aspect-ratio="1/1"
              cover
              :src="student.imgSubmit.src"
            ></v-img>
          </div>
        </div>
      </div>
      <div v-else-if="voteType === 'ITEM'">
        <h4>후보자 리스트</h4>
        <v-btn
          type="button"
          class="me-4"
          color="blue"
          @click="createCandidateItem()"
          >후보자 추가</v-btn
        >

        <div v-for="(student, index) in candidateList" :key="index">
          <v-text-field
            label="설명"
            v-model="student.candidateSubmit.candidate_spec"
          ></v-text-field>

          <v-text-field
            v-model="student.candidateSubmit.candidate_promise"
            label="공약"
          ></v-text-field>

          <v-file-input
            accept="image/*"
            @change="readFile(index)"
          ></v-file-input>

          <v-img
            :width="100"
            aspect-ratio="1/1"
            cover
            :src="student.imgSubmit.src"
          ></v-img>

          <span @click="deleteCandidate(index)">[삭제]</span>
        </div>
      </div>
      <div v-else>
        <h4>후보자 리스트(수정할 수 없습니다.)</h4>
        <div>1. 찬성</div>
        <div>2. 반대</div>
      </div>

      <v-btn type="button" class="me-4" color="blue" @click="addVote()">
        투표 추가
      </v-btn>
      <v-btn type="button" class="me-4" color="blue" @click="createVote(0)">
        투표 등록
      </v-btn>
    </v-form>
  </div>
  <CommonPopup :text="popText" />
  <CommonLoading />
</template>

<script>
import CommonPopup from "@/components/views/common/CommonPopup.vue";
import CommonLoading from "@/components/views/common/CommonLoading.vue";
import { ref } from "vue";
import api from "@/utils/api";

export default {
  name: "VoteView",
  props: {},
  data: () => ({
    voteNm: "",
    deptList: [
      "전체",
      "금융투자학과",
      "산업경영학과",
      "소프트웨어융합공학과",
      "메카트로닉스공학과",
    ],
    gradeList: [
      { title: "전체", value: 0 },
      { title: "1학년", value: 1 },
      { title: "2학년", value: 2 },
      { title: "3학년", value: 3 },
      { title: "4학년", value: 4 },
    ],
    dept: "",
    grade: "",
    voteType: "PEOPLE",
    date: ref,
    studentList: [],
    candidateList: [],
    // voteSubmit: {},
    candidateSubmit: [], // 학번, 설명, 공약, 이미지명
    imgSubmit: [], // 이미지 byte
    startDt: "",
    endDt: "",
    uploadImageFile: require("../../../assets/person.jpg"), // 기본 이미지
    imgList: [],
    bundleId: "",
    popText: "",
    formValidate: true,
    datePickerVal: false,
    searchVal: "",
    nmRules: [(v) => !!v || "투표 제목을 입력해주세요."],
    deptRules: [(v) => !!v || "학과를 선택해주세요."],
    gradeRules: [(v) => !!v || "학년을 선택해주세요."],
  }),
  components: {
    CommonPopup,
    CommonLoading,
  },
  created() {
    this.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${sessionStorage.getItem("access")}`;

    // console.log(
    //   'sessionStorage.getItem("access")',
    //   sessionStorage.getItem("access")
    // );

    // 학생 리스트 세팅
    this.loadStundetList();
  },
  mounted() {
    // date picker 세팅
    this.setDatePicker();
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
    // 랜덤 문자열 추출
    randomString() {
      this.bundleId = Math.random().toString(36).substring(2, 12);
    },

    // date picker 초기화
    setDatePicker() {
      const startDate = new Date();
      const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
      this.date.value = [startDate, endDate];
    },

    // date picker 형식 세팅(0000-00-00)
    dateFormatter(dt) {
      this.startDt =
        dt[0].getFullYear() +
        "-" +
        String(dt[0].getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dt[0].getDate() + 1).padStart(2, "0");

      this.endDt =
        dt[1].getFullYear() +
        "-" +
        String(dt[1].getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dt[1].getDate() + 1).padStart(2, "0");
    },

    // datepicker 관련
    handleDate(modelData) {
      console.log("modelData", modelData);
      this.datePickerVal = true;
    },

    // 투표 추가
    async createVote(code) {
      console.log("code", code);
      console.log("this.formValidate", this.formValidate);
      console.log("this.date", this.date);
      console.log("datePicker", this.datePickerVal);

      if (!this.formValidate || !this.datePickerVal) {
        return false;
      }

      // MONO, PEOPLE, ITEM 공통
      // 로딩바 추가
      this.$store.commit("setLoadingState", true);

      // 날짜 추출
      this.dateFormatter(this.date);

      // 1. 투표 데이터 생성
      const dataRes = await this.setData();
      console.log("dataRes", dataRes);

      // 2. 투표 등록
      const registerRes = await this.axios.post(
        "/members/vote/register",
        dataRes
      );

      console.log("registerRes", registerRes);

      // MONO
      if (this.voteType === "MONO") {
        // 3. 후보자 등록
        this.candidateList = [
          {
            candidate_id: "MONO_" + registerRes.data.vote_id + "_1",
            candidate_spec: "찬성",
            candidate_promise: "",
            vote_id: registerRes.data.vote_id,
          },
          {
            candidate_id: "MONO_" + registerRes.data.vote_id + "_2",
            candidate_spec: "반대",
            candidate_promise: "",
            vote_id: registerRes.data.vote_id,
          },
        ];
        // 4. 후보자 등록
        await this.axios
          .post("/members/candidate/register", this.candidateList)
          .then((res) => {
            if (res.status === 200) {
              this.popText = "투표 등록이 완료되었습니다.";
              this.$store.commit("setPopState", true);
              this.$store.commit("setLoadingState", false);
            }
          })
          .catch(function (error) {
            // 오류발생시 실행
            console.log("error", error);
          })
          .then(() => {
            // always executed
          });
      } else {
        // PEOPLE, ITEM
        console.log("this.candidateList", this.candidateList);

        // 3. 후보자 데이터 생성
        const cData = [];

        if (this.voteType === "ITEM") {
          for (var i = 0; i < this.candidateList.length; i++) {
            const candidate = {
              candidate_id: "ITEM_" + registerRes.data.vote_id + "_" + (i + 1),
              candidate_spec:
                this.candidateList[i].candidateSubmit.candidate_spec,
              candidate_promise:
                this.candidateList[i].candidateSubmit.candidate_promise,
              vote_id: registerRes.data.vote_id,
            };
            cData.push(candidate);
          }
        } else {
          for (var j = 0; j < this.candidateList.length; j++) {
            const candidate = {
              candidate_id: this.candidateList[j].student_id,
              candidate_spec:
                this.candidateList[j].candidateSubmit.candidate_spec,
              candidate_promise:
                this.candidateList[j].candidateSubmit.candidate_promise,
              vote_id: registerRes.data.vote_id,
            };
            cData.push(candidate);
          }
        }
        console.log("candidateRes", cData);

        // 4. 후보자 등록
        const candidateRes = await this.axios.post(
          "/members/candidate/register",
          cData
        );

        console.log("candidateRes", candidateRes);

        // 5. 이미지 데이터 생성
        const formData = new FormData();
        formData.append("vote_id", registerRes.data.vote_id);

        if (this.voteType === "ITEM") {
          for (var k = 0; k < this.candidateList.length; k++) {
            formData.append(
              "candidate_id",
              "ITEM_" + registerRes.data.vote_id + "_" + (k + 1)
            );
            formData.append("img", this.candidateList[k].imgSubmit.file);
          }
        } else {
          for (var l = 0; l < this.candidateList.length; l++) {
            formData.append("candidate_id", this.candidateList[l].student_id);
            formData.append("img", this.candidateList[l].imgSubmit.file);
          }
        }

        // 6. 이미지 등록
        const imgRes = await this.axios.post(
          "/members/candidate/img/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("imgRes", imgRes);
      }

      this.$store.commit("setLoadingState", false);

      // 투표 등록이면 메인으로 이동
      if (code === 0) {
        console.log("라우터요");
        this.$router.push({ path: "/" });
      }
    },

    // 학생 리스트 조회
    loadStundetList() {
      this.$store.commit("setLoadingState", true);

      api
        .get("/members/candidate/student")
        .then((res) => {
          this.studentList = res.data.map((item) => item);
          this.$store.commit("setLoadingState", false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },

    // 후보자 리스트 생성
    createCandidate(student) {
      student.candidateSubmit = {
        candidate_id: student.student_id,
        candidate_spec: "",
        candidate_promise: "",
      };

      student.imgSubmit = {
        vote_id: "",
        student_id: student.student_id,
        src: require("../../../assets/person.jpg"), //기본 이미지
        file: "",
      };

      this.candidateList.push(student);
    },

    // 후보자 삭제
    deleteCandidate(student) {
      // console.log("student", student);

      // 화면에 보여줄 데이터
      this.candidateList = this.candidateList.filter(
        (element) => element.student_id !== student.student_id
      );
      // console.log("filtered1", this.candidateList);
    },

    // 후보자 추가(사물)
    createCandidateItem() {
      const item = {
        vote_id: "",
        candidateSubmit: [
          {
            candidate_spec: "",
            candidate_promise: "",
          },
        ],
        imgSubmit: {
          vote_id: "",
          student_id: "",
          src: require("../../../assets/person.jpg"),
          file: "",
        },
      };

      this.candidateList.push(item);
    },

    // 투표 데이터 세팅
    async setData() {
      console.log(
        "this.$store.getters.getUserId",
        this.$store.getters.getUserId
      );
      if (this.bundleId === "") {
        this.randomString();
      }
      const voteSubmit = {
        vote_id: "",
        vote_bundle_id: this.bundleId,
        start_date: this.startDt, // 0000-00-00
        end_date: this.endDt,
        vote_name: this.voteNm,
        vote_type: this.voteType,
        grade: this.grade,
        major: this.dept,
        // user_id: this.$store.getters.getUserId,
        user_id: sessionStorage.getItem("user"),
      };

      return voteSubmit;
    },

    // 이미지 데이터 생성&미리보기
    readFile(index) {
      var input = event.target;
      console.log("input", input);
      console.log("input.files[0]", input.files[0]);
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          console.log("e", e);
          // 이미지 미리보기
          this.candidateList[index].imgSubmit.src = ref(e.target.result);
          // this.candidateList[index].imgSubmit.file = e.target.result;
          this.candidateList[index].imgSubmit.file = input.files[0];
        };
        reader.readAsDataURL(input.files[0]);
      }
    },

    // 투표 추가
    addVote() {
      // 기존 투표 등록
      this.createVote(1);

      // 데이터 초기화
      this.voteNm = "";
      this.dept = "";
      this.grade = "";
      this.startDt = "";
      this.endDt = "";
      this.candidateList = [];
      this.date = ref;
    },

    // 투표 타입 변경 시 후보자 데이터 초기화
    changeVote() {
      console.log("this.candidateList", this.candidateList);
      this.candidateList = [];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
