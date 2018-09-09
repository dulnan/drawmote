<script>
import { EventBus } from '@/events'

import Button from '@/components/Desktop/Toolbar/Button/Button.vue'
import Icon from '@/assets/icons/icon-redo.svg'

export default {
  extends: Button,

  name: 'ButtonRedo',

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
      EventBus.$emit('redoCanvas')
    },
    updateCanvasState ({ redoPossible }) {
      this.possible = redoPossible
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
