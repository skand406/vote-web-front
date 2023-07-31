<template>
  <v-app>
    <v-main>
      <LayoutHeader />
      <router-view/>
      <LayoutFooter />
    </v-main>
  </v-app>
</template>

<script>
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'


export default {
  name: 'App',
  components: {
    LayoutHeader,
    LayoutFooter
  },

  data: () => ({
    //
  }),
}
</script>
