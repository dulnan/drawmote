<template>
  <li class="text-bold mrgla hover relative language">
    <select
      v-model="$i18n.locale"
      class="language__select"
      @change="handleLanguageChange"
    >
      <option v-for="(lang, i) in languages" :key="`Lang${i}`" :value="lang.key">{{ lang.label }}</option>
    </select>
    <div class="text-bold pdg h-100 language__button">
      <span class="arrow-after hidden-sm-down">{{ currentLanguage.label }}</span>
      <span class="arrow-after hidden-md-up text-uppercase">{{ currentLanguage.key }}</span>
    </div>
  </li>
</template>

<script>
import { setLocale } from '@/tools/cookies'

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
      const currentLanguage = this.languages.find(l => l.key === this.$i18n.locale)

      // Return English as a fallback if for some reason i18n doesn't return
      // anything.
      return currentLanguage || this.languages[1]
    }
  },

  methods: {
    handleLanguageChange (e) {
      setLocale(e.target.value)
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
