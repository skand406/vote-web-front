<template>
    <div class="hello">
      Test page
      <router-link to="/info">인포닷</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TestVue',
    props: {},
    mounted() {
        // this.getApi()
    },
    methods: {
        async getApi() {
            console.log('get Api')
            const response = await this.axios({
                url: '/auth/hello',
                method: 'GET',
            })

            console.log('res', response)
        }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

  </style>
  