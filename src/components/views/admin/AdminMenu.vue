<template>
  <div
    style="width: 300px; height: calc(100vh - 48px); border: 1px solid black"
  >
    <h2>메뉴</h2>
    <ul>
      <li>
        <router-link to="/admin">투표 수정</router-link>
      </li>
      <li>
        <router-link to="/admin">유저 수정</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
// import CommonPopup from '@/components/views/common/CommonPopup.vue'
// import CommonLoading from '@/components/views/common/CommonLoading.vue'

export default {
  name: "AdminMenu",
  components: {
    // CommonPopup,
    // CommonLoading
  },
  mounted() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
