<template>
  <div>
    <h1>어드민 메인 페이지</h1>

    <div v-for="(item, index) in voteList" :key="index">
      {{item}}} {{index}}
    </div>


    <CommonLoading />
  </div>
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading";
import api from "@/utils/api";

export default {
  name: "AdminMain",
  props: {},
  components: {
    CommonLoading,
  },
  data() {
    return {
      voteList: []
    };
  },
  mounted() {
    this.locadVoteList();
  },
  methods: {
    locadVoteList() {

      this.$store.commit("setLoadingState", false);


      api
          .get("/admins/vote")
          .then((res) => {
            console.log("res", res);
            this.voteList = res.data.map((item) => item);
            // let jsonData = JSON.stringify(res.data);
            // console.log(jsonData);

          })
          .catch(function (error) {
            // 오류발생시 실행
            console.log("error", error);
          })
          .then(() => {
            // always executed
            this.$store.commit("setLoadingState", false);
          });
    },
  },
};
</script>

<style scoped>

</style>