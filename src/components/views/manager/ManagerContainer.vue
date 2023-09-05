<template>
  <div>
    <h1>매니저 루트</h1>
    <LayoutHeader />
    <router-view />
    <LayoutFooter />
  </div>
</template>

<script>
import LayoutHeader from "@/components/layout/LayoutHeader.vue";
import LayoutFooter from "@/components/layout/LayoutFooter.vue";

// import CommonPopup from '@/components/views/common/CommonPopup.vue'
// import CommonLoading from '@/components/views/common/CommonLoading.vue'

export default {
  name: "ManagerContainer",
  props: {},
  components: {
    // CommonPopup,
    // CommonLoading
    LayoutHeader,
    LayoutFooter,
  },
  mounted() {},
  methods: {
    openPopup() {
      this.$store.commit("setPopState", true);
    },

    openLoading() {
      this.$store.commit("setLoadingState", true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
