<template>
  <div v-if="this.$store.getters.getPopState">
      <h1>팝업창</h1>
      <h4> {{text}} </h4>
      <button @click="closePopup()">닫기</button>
  </div>
</template>
  
<script>

export default {
  name: 'PopupView',
  props: { 
    text: String
  },
  components: {
  },
  mounted() {
  },
  methods: {
      closePopup() {
        this.$store.commit('setPopState', false)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
