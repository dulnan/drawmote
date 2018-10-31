<template>
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
</template>

<script>
import { setCookie } from '@/tools/helpers'

export default {
  name: 'FooterLanguage',

  props: {
    isMobile: false
  },

  data () {
    return {
      languages: [
        {
          key: 'de',
          label: 'Deutsch'
        },
        {
          key: 'en',
          label: 'English'
        }
      ]
    }
  },

  computed: {
    currentLanguage () {
      return this.languages.find(l => l.key === this.$i18n.locale)
    }
  },

  methods: {
    handleLanguageChange (e) {
      setCookie('locale', e.target.value)
    }
  }
}
</script>

<style lang="scss">
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
</style>
