<script>
import { EventBus } from '@/events'

import Button from '@/components/Desktop/Toolbar/Button/Button.vue'
import Icon from '@/assets/icons/icon-redo.svg'

export default {
  name: 'ButtonRedo',

  components: {
    Icon
  },
  extends: Button,

  data() {
    return {
      hasIcon: true,
      possible: false
    }
  },

  computed: {
    additionalClasses() {
      return this.possible ? [] : ['disabled']
    }
  },

  beforeDestroy() {
    EventBus.$on('canvasState', this.updateCanvasState)
  },

  mounted() {
    EventBus.$on('canvasState', this.updateCanvasState)
  },

  methods: {
    handleClick() {
      if (this.possible) {
        EventBus.$emit('redoCanvas')
        this.$track('Toolbar', 'history', 'redo')
      }
    },
    updateCanvasState({ redoPossible }) {
      this.possible = redoPossible
    }
  }
}
</script>
