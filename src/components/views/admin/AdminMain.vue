<template>
  <div>
    <h1>어드민 메인 페이지</h1>

    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="voteList"
      item-value="name"
      class="elevation-1"
      @click:row=voteDetail
    ></v-data-table>

    <CommonLoading />
  </div>
</template>

<script>
import CommonLoading from "@/components/views/common/CommonLoading";
import api from "@/utils/api";
import {
  VDataTable,
} from "vuetify/labs/VDataTable";

export default {
  name: "AdminMain",
  props: {},
  components: {
    CommonLoading,
    VDataTable,
  },
  data() {
    return {
      voteList: [],
      page: 1,
      itemsPerPage: 15,
      headers: [
        {
          key: "vote_id",
          sortable: false,
          title: "투표 ID",
        },
        { title: "투표 번들 ID", key: "vote_bundle_id" },
        { title: "투표명", key: "vote_name" },
        { title: "시작일", key: "start_date" },
        { title: "종료일", key: "end_date" },
        { title: "완전종료일", key: "last_end_date" },
        { title: "투표 타입", key: "vote_type" },
        { title: "학년", key: "grade" },
        { title: "학과", key: "major" },
        { title: "유저 ID", key: "user_id" },
        { title: "투표 활성화", key: "vote_active" },
      ],
    };
  },
  mounted() {
    this.locadVoteList();
  },
  computed: {
    pageCount() {
      return Math.ceil(this.voteList.length / this.itemsPerPage);
    },
  },
  methods: {
    locadVoteList() {
      this.$store.commit("setLoadingState", true);

      api
        .get("/admins/vote")
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
          this.$store.commit("setLoadingState", false);
        });
    },

    voteDetail(event, {item}) {
      console.log('아이템', event, item);

      this.$store.commit("setAdminVoteDetail", JSON.stringify(item.columns));

      this.$router.push({
        path: `/admin/${item.columns.vote_id}/voteDetail`,
        props: {id: item.columns.vote_id}
      });
    }
  },
};
</script>

<style scoped></style>
