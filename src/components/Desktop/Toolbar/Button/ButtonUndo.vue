<script>
import { EventBus } from '@/events'

import Button from '@/components/Desktop/Toolbar/Button/Button.vue'
import Icon from '@/assets/icons/icon-undo.svg'

export default {
  name: 'ButtonUndo',

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
        EventBus.$emit('undoCanvas')
        this.$track('Toolbar', 'history', 'undo')
      }
    },

    updateCanvasState({ undoPossible }) {
      this.possible = undoPossible
    }
  }
}
</script>
