<script>
import { EventBus } from '@/events'

import Button from '@/components/Desktop/Toolbar/Button/Button.vue'
import Icon from '@/assets/icons/icon-delete.svg'

export default {
  extends: Button,

  components: {
    Icon
  },

  data () {
    return {
      hasIcon: true
    }
  },

  name: 'ButtonClear',

  methods: {
    handleClick () {
      EventBus.$emit('clearCanvas')
    }
  }
}
</script>
