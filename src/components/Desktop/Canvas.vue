<script>
export default {
  name: 'Canvas',

  methods: {
    setupCanvases (viewport) {
      Object.keys(this.$refs).forEach(refKey => {
        let canvas = this.$refs[refKey]
        let context = canvas.getContext('2d')

        canvas.width = viewport.width
        canvas.height = viewport.height

        context.scale(viewport.ratio, viewport.ratio)
      })
    },

    copyToCanvas (source, target, viewport) {
      const contextTarget = target.getContext('2d')
      const contextSource = source.getContext('2d')

      contextTarget.drawImage(source, 0, 0, this.$global.state.sizes.viewport.width, this.$global.state.sizes.viewport.height)

      this.clear(contextSource, viewport)
    },

    clear (context, viewport) {
      context.clearRect(0, 0, viewport.width, viewport.height)
    },

    clearOutside (context, rect, viewport) {
      // top
      context.clearRect(0, 0, viewport.width, rect.top)
      // left
      context.clearRect(0, 0, rect.left, viewport.height)
      // bottom
      context.clearRect(0, rect.top + rect.height, viewport.width, viewport.height - rect.height - rect.top)
      // right
      context.clearRect(rect.left + rect.width, 0, rect.left + rect.width, viewport.height)
    }
  }
}
</script>
