<template>
  <div class="footer" ref="footer">
    <div class="footer__content">
      <ul class="list-inline list-inline--divided list-inline--tight text-small footer__list">
        <li class="relative footer__browser-support">
          <button
            class="btn btn--bare text-bold check pdg lg-pdg+ h-100 hover"
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
        <li class="text-bold mrgla hover relative language">
          <select
            v-model="$i18n.locale"
            class="language__select"
            @change="handleLanguageChange"
          >
            <option v-for="(lang, i) in languages" :key="`Lang${i}`" :value="lang.key">{{ lang.label }}</option>
          </select>
          <div class="text-bold pdg lg-pdg+ h-100 language__button">
            <span class="arrow-after hidden-sm-down">{{ currentLanguage.label }}</span>
            <span class="arrow-after hidden-md-up text-uppercase">{{ currentLanguage.key }}</span>
          </div>
        </li>
        <li class="text-bold mrgla hover">
          <a class="pdg lg-pdg+ block" href="https://github.com/dulnan/drawmote-client">
            <icon-github class="icon icon--large" />
            <span class="hidden-sm-down">GitHub</span>
          </a>
        </li>
        <li class="flex-1 text-right hidden-xs-down footer__about">
          <div class="pdg lg-pdg+">
            Made by <a href="http://www.janhug.info" class="text-bold">Jan Hug</a> at
            <a href="https://www.liip.ch"><liip-logo /></a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'

import { EventBus } from '@/events'
import { setCookie } from '@/tools/helpers'
import BrowserSupport from '@/components/BrowserSupport.vue'

import IconGithub from '@/assets/icons/icon-github.svg'
import LiipLogo from '@/assets/icons/liip-logo.svg'

export default {
  name: 'Footer',

  components: {
    BrowserSupport,
    IconGithub,
    LiipLogo
  },

  props: {
    isMobile: false
  },

  data () {
    return {
      supportState: 'checking',
      browserSupportVisible: false,
      languages: [
        {
          key: 'de',
          label: 'Deutsch'
        },
        {
          key: 'en',
          label: 'English'
        }
      ],
      isConnected: false
    }
  },

  computed: {
    currentLanguage () {
      return this.languages.find(l => l.key === this.$i18n.locale)
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
    },

    handleLanguageChange (e) {
      setCookie('locale', e.target.value)
    },

    updateSizes () {
      this.$loop.mutate('updateFooterRect', this.$refs.footer.getBoundingClientRect())
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
@import '@/assets/scss/components/_check.scss';

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
  // box-shadow: inset 0 2px 7px $alt-color-light;
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

.footer__browser-support {
  flex: 1;
  z-index: 1;
  > .btn {
    width: 100%;
    text-align: left;
    transition: 0.4s;
    background: $alt-color-lighter;
    &.is-open {
      background: white;
    }
  }
  @include media('sm') {
    flex: 0 0 auto;
  }
}

.language__select {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  opacity: 0;
  &:focus {
    outline: none;
  }
}

.footer__about {
  svg {
    height: 0.7em;
    margin-left: 0.5rem;
  }
}
</style>
