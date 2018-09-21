export default {
  name: 'Canvas',

  methods: {
    setupCanvases (viewport, canvases) {
      const dpi = Math.min(window.devicePixelRatio, 1.5)

      canvases.forEach(canvas => {
        let context = canvas.getContext('2d')

        canvas.width = viewport.width * dpi
        canvas.height = viewport.height * dpi

        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`

        context.scale(dpi, dpi)
      })
    },

    clear (context, viewport) {
      context.clearRect(0, 0, viewport.width, viewport.height)
    }
  }
}
