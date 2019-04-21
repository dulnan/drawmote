<script>
import Rectangle from '@/classes/Rectangle'

export default {
  name: 'ToolbarItem',

  props: {
    tool: {
      type: Object,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    hoveredKey: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      hasIcon: false
    }
  },

  computed: {
    itemKey() {
      return `${this.action}${this.tool.id}`
    },

    isHovered() {
      return this.itemKey === this.hoveredKey
    },

    classes() {
      return [
        {
          hover: this.isHovered,
          active: this.isActive
        },
        'toolbar-item',
        'toolbar-item--' + this.groupId,
        ...this.additionalClasses
      ]
    },

    additionalClasses() {
      return []
    },

    style() {
      return {}
    }
  },

  methods: {
    getRectangle() {
      const el = this.$el

      // Easiest quick solution for getting the left offset in the toolbar.
      const group = el.parentElement.parentElement.parentElement
      const parentOffsetLeft = group.offsetLeft

      const x = el.offsetLeft + parentOffsetLeft
      const y = 0
      const width = el.offsetWidth
      const height = el.offsetHeight

      const rectangle = new Rectangle(x, y, width, height)

      return {
        coords: rectangle,
        key: this.itemKey,
        el: this.$el
      }
    }
  }
}
</script>
