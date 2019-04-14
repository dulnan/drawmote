<template>
  <li class="relative footer-browser-support">
    <button
      class="btn btn--bare text-bold check pdg lg-pdg h-100 hover footer-text"
      @click="toggleBrowserSupport"
      :class="[supportState, { 'is-open': browserSupportVisible }]"
    >
      <div class="check__title">
        <span class="arrow-after">{{ $t(`browserSupport.footer.${supportState}`) }}</span>
      </div>
    </button>
    <browser-support
      :is-mobile="isMobile"
      v-show="browserSupportVisible"
      @supportState="handleBrowserSupportState"
      @close="closeBrowserSupport"
    />
  </li>
</template>

<script>
import BrowserSupport from '@/components/Common/BrowserSupport.vue'

export default {
  name: 'FooterBrowserSupport',

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
    toggleBrowserSupport () {
      this.browserSupportVisible = !this.browserSupportVisible
      this.$track('BrowserSupport', 'show', 1)
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
@import '@/assets/scss/components/_check.scss';

.footer-browser-support {
  flex: 1;
  z-index: 1;
  > .btn {
    width: 100%;
    text-align: left;
    &.is-open {
      background: $color-translucent-dark;
    }
  }
  @include media('sm') {
    flex: 0 0 auto;
  }
}
</style>
