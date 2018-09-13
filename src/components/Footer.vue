<template>
  <div class="footer">
    <ul class="list-inline list-inline--divided text-small">
      <li class="pdg">
        <div class="text-bold" @click="showBrowserSupport">
          <span v-if="browserNotSupported">Reduced functionality</span>
          <span v-else>All features available</span>
        </div>
        <browser-support v-show="browserSupportVisible" @notSupported="handleBrowserSupportState"/>
      </li>
      <li class="pdg flex-1 text-center hidden-sm-down">Made by <a href="http://www.janhug.info">Jan Hug</a>, with help from Pascal Thormeier and others.</li>
      <li class="pdg text-bold mrgla hidden-sm-down"><a href="#" @click="skipPairing">Use without phone</a></li>
      <li class="pdg text-bold mrgla"><a href="https://github.com/dulnan/drawmote-client">View on GitHub</a></li>
    </ul>
  </div>
</template>

<script>
import { EventBus } from '@/events'
import BrowserSupport from '@/components/BrowserSupport.vue'

export default {
  name: 'Footer',

  components: {
    BrowserSupport
  },

  props: {
    isMobile: false
  },

  data () {
    return {
      browserNotSupported: false,
      browserSupportVisible: false
    }
  },

  methods: {
    skipPairing () {
      EventBus.$emit('isConnected', true)
    },

    showBrowserSupport () {
      this.browserSupportVisible = true
    },

    handleBrowserSupportState () {
      this.browserNotSupported = true
      this.browserSupportVisible = true
    }
  }
}
</script>

<style lang="scss">
.footer {
  position: fixed;
  background: $alt-color-lighter;
  z-index: $index-footer;
  right: 0;
  left: 0;
  bottom: 0;
  border-top: $list-separator-style;
}
</style>
