<template>
  <div class="footer">
    <ul class="list-inline list-inline--divided list-inline--tight text-small footer__list">
      <li class="relative hover">
        <button
          class="btn btn--bare text-bold check pdg"
          @click="toggleBrowserSupport"
          :class="supportState"
        >
          <div class="check__title">
            <span>{{ $t(`browserSupport.footer.${supportState}`) }}</span>
          </div>
        </button>
        <browser-support
          :is-mobile="isMobile"
          v-show="browserSupportVisible"
          @supportState="handleBrowserSupportState"
          @close="closeBrowserSupport"
        />
      </li>
      <li class="flex-1 text-center hidden-sm-down">
        <div class="pdg">
          Made by <a href="http://www.janhug.info">Jan Hug</a>, with help from Pascal Thormeier and others.
        </div>
      </li>
      <li class="text-bold mrgla hidden-sm-down hover">
        <button class="btn btn--bare btn--link pdg" @click="skipPairing">Use without phone</button>
      </li>
      <li class="text-bold mrgla hover">
        <a class="pdg block" href="https://github.com/dulnan/drawmote-client">View on GitHub</a>
      </li>
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
      supportState: 'checking',
      browserSupportVisible: false
    }
  },

  methods: {
    skipPairing () {
      EventBus.$emit('isConnected', true)
    },

    toggleBrowserSupport () {
      this.browserSupportVisible = !this.browserSupportVisible
    },

    handleBrowserSupportState (state) {
      this.supportState = state

      if (state !== 'supported') {
        this.browserSupportVisible = true
      }
    },

    closeBrowserSupport () {
      this.browserSupportVisible = false
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
  user-select: none;
}

.footer__list {
  align-items: stretch;
  .hover:hover {
    background: white;
  }
}
</style>
