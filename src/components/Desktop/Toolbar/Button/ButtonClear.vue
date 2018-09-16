<script>
import { EventBus } from '@/events'

import Button from '@/components/Desktop/Toolbar/Button/Button.vue'
import Icon from '@/assets/icons/icon-delete.svg'

export default {
  extends: Button,

  name: 'ButtonClear',

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
      EventBus.$emit('clearCanvas')
      this.$track('Toolbar', 'history', 'clear')
    },

    updateCanvasState ({ clearPossible }) {
      this.possible = clearPossible
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
