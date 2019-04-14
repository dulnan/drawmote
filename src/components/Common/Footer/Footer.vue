<template>
  <div class="footer" ref="footer">
    <div class="footer__content">
      <ul class="list-inline list-inline--tight text-small footer__list">
        <footer-browser-support :is-mobile="isMobile" />
        <footer-language />
        <footer-github />
        <footer-connection v-if="!isMobile" />
        <footer-copyright />
      </ul>
    </div>
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'

import FooterBrowserSupport from '@/components/Common/Footer/FooterBrowserSupport.vue'
import FooterCopyright from '@/components/Common/Footer/FooterCopyright.vue'
import FooterConnection from '@/components/Common/Footer/FooterConnection.vue'
import FooterGithub from '@/components/Common/Footer/FooterGithub.vue'
import FooterLanguage from '@/components/Common/Footer/FooterLanguage.vue'

export default {
  name: 'Footer',

  components: {
    FooterBrowserSupport,
    FooterCopyright,
    FooterConnection,
    FooterGithub,
    FooterLanguage
  },

  props: {
    isMobile: false
  },

  methods: {
    updateSizes () {
      const footer = this.$refs.footer
      this.$vuetamin.store.mutate('updateFooterRect', footer)
    }
  },

  mounted () {
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
}

.footer__list {
  align-items: stretch !important;
  @include media('sm') {
    .hover {
      &:hover {
        background: $color-translucent-dark;
      }
    }
  }
}
</style>
