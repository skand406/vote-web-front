<template>
    <nav>
      <router-link to="/">로고</router-link>&nbsp;
      <router-link to="/login">로그인</router-link>&nbsp;
      <router-link to="/signup">회원가입</router-link>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'headerView',
    props: {},
    mounted() {
    },
    methods: {
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

  </style>
  