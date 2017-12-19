<template>
  <div class="hello">
    <h1>CANVAS</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    ...mapGetters([
      'isConnected'
    ])
  },
  watch: {
    isConnected (isConnected) {
      if (isConnected) {
        console.log("it's connected")
        this.$store.dispatch('socket/getPairingToken')
      }
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
