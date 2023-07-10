<template>
  <LayoutHeader />  
  <router-view />
  <LayoutFooter />
</template>

<script>
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'

export default {
  name: 'App',
  components: {
    LayoutHeader,
    LayoutFooter
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
