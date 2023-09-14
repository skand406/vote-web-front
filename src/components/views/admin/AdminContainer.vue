<template>
  <div>
    <h1>어드민 루트</h1>
    <div style="display: flex">
      <AdminMenu />
      <div style="width: 100%;">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// import CommonPopup from '@/components/views/common/CommonPopup.vue'
// import CommonLoading from '@/components/views/common/CommonLoading.vue'
import AdminMenu from "@/components/views/admin/AdminMenu.vue";

export default {
  name: "AdminContainer",
  props: ["id"],
  components: {
    // CommonPopup,
    // CommonLoading
    AdminMenu,
  },
  mounted() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
