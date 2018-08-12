<script>
import { getRgbaString } from '@/tools/helpers.js'

export default {
  name: 'BrushToolbarItem',

  props: {
    tool: Object,
    action: String,
    hoveredKey: String
  },

  computed: {
    itemKey () {
      return `${this.action}${this.tool.id}`
    },
    classes () {
      return {
        'hover': this.itemKey === this.hoveredKey
      }
    },
    style () {
      if (!this.tool.background) {
        return {}
      }

      return {
        background: getRgbaString(this.tool.background, 1),
        color: getRgbaString(this.tool.background, 0.5)
      }
    }
  },

  methods: {
    getRectangle () {
      const rect = this.$el.getBoundingClientRect()

      let coords = {}
      coords.x1 = rect.left
      coords.y1 = rect.top
      coords.x2 = rect.left + rect.width
      coords.y2 = rect.top + rect.height

      return {
        coords: coords,
        key: this.itemKey
      }
    }
  }
}
</script>
