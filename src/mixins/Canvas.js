export default {
  name: 'Canvas',

  methods: {
    setupCanvases (viewport, canvases) {
      canvases.forEach(canvas => {
        let context = canvas.getContext('2d')

        canvas.width = viewport.width
        canvas.height = viewport.height

        context.scale(viewport.ratio, viewport.ratio)
      })
    },

    clear (context, viewport) {
      context.clearRect(0, 0, viewport.width, viewport.height)
    }
  }
}
