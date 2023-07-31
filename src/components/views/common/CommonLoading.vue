<template>
    <div v-if="this.$store.getters.getLoadingState">
      <h1>로딩창</h1>

      <div id="overlay">
        <span class="loader"></span>
      </div>
    </div>
  </template>
  
  <script>

  export default {
    name: 'LoadingView',
    props: {},
    components: {
    },
    mounted() {
    },
    methods: {
        
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    #overlay {
      /* display: none; */
      background: #ffffff;
      color: #666666;
      position: fixed;
      height: 100%;
      width: 100%;
      z-index: 5000;
      top: 0;
      left: 0;
      float: left;
      text-align: center;
      padding-top: 25%;
      opacity: .80;
  }

  .loader {
      width: 48px;
      height: 48px;
      border: 5px solid black;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
      position: absolute;
      margin: 0 auto;
  }

  </style>
  