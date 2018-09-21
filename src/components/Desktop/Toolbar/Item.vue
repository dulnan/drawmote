<script>
import Rectangle from '@/classes/Rectangle'

export default {
  name: 'ToolbarItem',

  props: {
    tool: Object,
    action: String,
    hoveredKey: String,
    isPressing: Boolean,
    groupId: String
  },

  data () {
    return {
      hasIcon: false
    }
  },

  computed: {
    itemKey () {
      return `${this.action}${this.tool.id}`
    },

    classes () {
      return [
        {
          'hover': this.itemKey === this.hoveredKey,
          'active': this.isActive
        },
        'toolbar-item',
        'toolbar-item--' + this.groupId,
        ...this.additionalClasses
      ]
    },

    additionalClasses () {
      return []
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
        key: this.itemKey,
        el: this.$el
      }
    }
  }
}
</script>
