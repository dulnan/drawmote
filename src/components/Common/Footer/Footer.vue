<template>
  <div class="footer" ref="footer">
    <div class="footer__content">
      <ul class="list-inline list-inline--divided list-inline--tight text-small footer__list">
        <footer-browser-support :is-mobile="isMobile" />
        <footer-language />
        <footer-github />
        <footer-copyright />
      </ul>
    </div>
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'

import { EventBus } from '@/events'

import FooterBrowserSupport from '@/components/Common/Footer/FooterBrowserSupport.vue'
import FooterCopyright from '@/components/Common/Footer/FooterCopyright.vue'
import FooterGithub from '@/components/Common/Footer/FooterGithub.vue'
import FooterLanguage from '@/components/Common/Footer/FooterLanguage.vue'

export default {
  name: 'Footer',

  components: {
    FooterBrowserSupport,
    FooterCopyright,
    FooterGithub,
    FooterLanguage
  },

  props: {
    isMobile: false
  },

  data () {
    return {
      isConnected: false
    }
  },

  methods: {
    updateSizes () {
      this.$vuetamin.store.mutate('updateFooterRect', this.$refs.footer.getBoundingClientRect())
    }
  },

  mounted () {
    EventBus.$on('isConnected', (isConnected) => {
      this.isConnected = isConnected
    })
    this.updateSizes()
    debouncedResize((e) => {
      this.updateSizes()
    })
  }
}
</script>

<style lang="scss">
.footer {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  user-select: none;
  z-index: $index-footer;
}

.footer__content {
  position: relative;
  z-index: $index-footer;
  background: $alt-color-lighter;
  border-top: 1px solid $alt-color-light;
}

.footer__list {
  align-items: stretch !important;
  @include media('sm') {
    .hover {
      &:hover {
        background: white;
      }
    }
  }
}
</style>
