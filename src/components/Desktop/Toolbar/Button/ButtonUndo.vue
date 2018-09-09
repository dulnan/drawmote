<script>
import { EventBus } from '@/events'

import Button from '@/components/Desktop/Toolbar/Button/Button.vue'
import Icon from '@/assets/icons/icon-undo.svg'

export default {
  extends: Button,

  name: 'ButtonUndo',

  components: {
    Icon
  },

  data () {
    return {
      hasIcon: true,
      possible: false
    }
  },

  computed: {
    additionalClasses () {
      return this.possible ? [] : ['disabled']
    }
  },

  methods: {
    handleClick () {
      EventBus.$emit('undoCanvas')
    },

    updateCanvasState ({ undoPossible }) {
      this.possible = undoPossible
    }
  },

  beforeDestroy () {
    EventBus.$on('canvasState', this.updateCanvasState)
  },

  mounted () {
    EventBus.$on('canvasState', this.updateCanvasState)
  }
}
</script>
