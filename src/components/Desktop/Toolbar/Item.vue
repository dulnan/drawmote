<script>
import { EventBus } from '@/events'

import Rectangle from '@/classes/Rectangle'

export default {
  name: 'BrushToolbarItem',

  props: {
    tool: Object,
    action: String,
    hoveredKey: String,
    isPressing: Boolean
  },

  computed: {
    itemKey () {
      return `${this.action}${this.tool.id}`
    },

    classes () {
      return {
        'hover': this.itemKey === this.hoveredKey,
        'active': this.isActive
      }
    },

    style () {
      return {}
    }
  },

  methods: {
    getRectangle () {
      const rect = this.$el.getBoundingClientRect()

      const rectangle = new Rectangle(rect.left, rect.top, rect.width, rect.height)

      return {
        coords: rectangle,
        key: this.itemKey
      }
    },

    handleClick () {}
  },

  created () {
    const eventName = 'pointerOver_' + this.itemKey
    EventBus.$on(eventName, this.handleClick)
  }
}
</script>
