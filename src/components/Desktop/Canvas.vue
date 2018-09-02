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

    clearOutside (context, rectangle) {
      const x = rectangle.p1.x
      const y = rectangle.p1.y

      const width = rectangle.p2.x - x
      const height = rectangle.p2.y - y

      context.beginPath()
      context.rect(x, y, width, height)
      context.clip()
    }
  }
}
</script>
