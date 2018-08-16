<script>
import { EventBus } from '@/events'

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

      let coords = {}
      coords.x1 = Math.round(rect.left)
      coords.y1 = Math.round(rect.top)
      coords.x2 = Math.round(rect.left + rect.width)
      coords.y2 = Math.round(rect.top + rect.height)

      return {
        coords: coords,
        key: this.itemKey
      }
    },

    handleClick () {
      console.log(this.itemKey)
    }
  },

  created () {
    const eventName = 'pointerOver_' + this.itemKey
    EventBus.$on(eventName, this.handleClick)
  }
}
</script>
