<template>
    <div>
        <h1>홈이닷</h1>

        <!-- 팝업 컴포넌트 -->
        <button @click="openPopup()">팝업창 오픈!</button>
        <CommonPopup text="텍스트 전달이용" />
    </div>
  </template>
  
  <script>
  import CommonPopup from '@/components/views/common/CommonPopup.vue'

  export default {
    name: 'HomeView',
    props: {},
    components: {
      CommonPopup
    },
    mounted() {
    },
    methods: {
      openPopup() {
        this.$store.commit('setPopState', true);
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

  </style>
  