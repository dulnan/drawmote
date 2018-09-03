<script>
import { EventBus } from '@/events'

import Button from '@/components/Desktop/Toolbar/Button/Button.vue'

export default {
  extends: Button,

  name: 'ToolbarButtonClear',

  methods: {
    handleClick () {
      EventBus.$emit('clearCanvas')
    }
  }
}
</script>
