<template>
    <div>
        <h1>홈이닷</h1>

        <!-- 팝업 컴포넌트 -->
        <v-btn @click="openPopup()">
          팝업창 오픈!
        </v-btn>

        <CommonPopup text="텍스트 전달이용" />

        <!-- 로딩 컴포넌트 -->
        <button @click="openLoading()">로딩창 오픈!</button>
        <CommonLoading />
    </div>
  </template>
  
  <script>
  import CommonPopup from '@/components/views/common/CommonPopup.vue'
  import CommonLoading from '@/components/views/common/CommonLoading.vue'

  export default {
    name: 'HomeView',
    props: {},
    components: {
      CommonPopup,
      CommonLoading
    },
    mounted() {
    },
    methods: {
      openPopup() {
        this.$store.commit('setPopState', true);
      },

      openLoading() {
        this.$store.commit('setLoadingState', true);
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

  </style>
  