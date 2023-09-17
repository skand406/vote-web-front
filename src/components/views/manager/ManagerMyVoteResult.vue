<template>
  <div>
    <h2>투표 결과 페이지</h2>
    <div style="width: 400px;">
      <h5>당선인 결과</h5>
      <canvas id="myChart"></canvas>
    </div>
    <div style="width: 400px;">
      <h5>전체 참여율 결과</h5>
      <canvas id="myChart2"></canvas>
    </div>
    <div style="width: 400px;">
      <h5>학년별 결과</h5>
      <canvas id="myChart3"></canvas>
    </div>
    <div style="width: 400px;">
      <h5>학과별 결과</h5>
      <canvas id="myChart4"></canvas>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";
import Chart from "chart.js/auto";

export default {
  name: "MyVoteResultView",
  props: ["id"],
  data() {
    return {
      voteList: [],
      candidateList: [],
      chartData: [],
      gradeList: [],
      majorList: [],
      gradeV: [],
      majorV: []
    };
  },
  components: {},
  mounted() {
    this.loadVoteResult();
  },
  methods: {
    async loadVoteResult() {
      // console.log("결과 데이터 로드");
      this.voteList = await JSON.parse(this.$store.getters.getVoteDetail);
      // console.log("voteList", this.voteList);

      const { vote_id } = this.voteList;

      await api
        .get(`/members/vote/result/${vote_id}`, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // console.log("!!!!!!!!!res", res);
          if (res.status === 200) {
            this.drawChart(res.data);
          }
        })
        .catch(function (error) {
          // 오류발생시 실행
          console.log("$$$$$$$$$$$$$$error", error);
        });
    },

    drawChart(data) {
      // console.log("그리기", data);
      const ctx = document.getElementById("myChart");
      const ctx2 = document.getElementById("myChart2");
      const ctx3 = document.getElementById("myChart3");
      const ctx4 = document.getElementById("myChart4");

      Object.keys(data.candidate).forEach((key) => {
        const value = data.candidate[key];
        // console.log(`키: ${key}, 값: ${value}`);

        this.candidateList.push(key);
        this.chartData.push(value);
      });

      Object.keys(data.grade).forEach((key) => {
        const value = data.grade[key];
        // console.log(`키: ${key}, 값: ${value}`);

        this.gradeList.push(key);
        this.gradeV.push(value)
      });

      Object.keys(data.major).forEach((key) => {
        const value = data.major[key];
        // console.log(`키: ${key}, 값: ${value}`);

        this.majorList.push(key);
        this.majorV.push(value)
      });


      // 당선인 결과 그래프
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.candidateList,
          datasets: [
            {
              label: "투표 당선인",
              data: this.chartData,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // 전체 참여율 결과 그래프
      const total = data.total
      const participants = data.participants

      new Chart(ctx2, {
        type: "pie",
        data: {
          labels: ["투표한 학생", "투표하지 않은 학생"],
          datasets: [
            {
              label: "전체 참여율",
              data: [participants, total-participants],
              hoverOffset: 4,
            },
          ],
        },
      });

      // 학년별 결과 그래프
      new Chart(ctx3, {
        type: "bar",
        data: {
          labels: this.gradeList,
          datasets: [
            {
              label: "학년별 결과",
              data: this.gradeV,
              hoverOffset: 4,
            },
          ],
        },
      });

      // 학과별 결과 그래프
      new Chart(ctx4, {
        type: "bar",
        data: {
          labels: this.majorList,
          datasets: [
            {
              label: "학과별 결과",
              data: this.majorV,
              hoverOffset: 4,
            },
          ],
        },
      });

    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
