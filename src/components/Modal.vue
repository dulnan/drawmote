<template>
  <transition name="appear">
    <div v-if="isVisible" class="modal fixed overlay flex flex--center">
      <div class="modal__window">
        <div class="modal__header">
          <h1 class="mrgb">{{ title }}</h1>
          <h2 class="mrgb">{{ subtitle }}</h2>
        </div>
        <div class="modal__content lead">
          {{ content }}
        </div>
      </div>
      <div class="absolute overlay modal__background"></div>
      <!--<div class="video">-->
        <!--<video preload="auto" autoplay="autoplay" muted="muted" loop="loop">-->
          <!--<source src="/static/video/are-you-sure.mp4" type="video/mp4">-->
        <!--</video>-->
      <!--</div>-->
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',

  data () {
    return {
      isVisible: true,
      title: 'Are you sure about that?',
      subtitle: 'Connecting your smartphone is half the fun.',
      content: `If you skip this step, you can just use your mouse to draw. But since this app is all about drawing using your smartphone, you will miss out on around 95% of the fun. Decide for yourself! ¯\\_(ツ)_/¯ `
    }
  },

  methods: {
    hideModal () {
      this.isVisible = false
    },

    showModal () {
      this.isVisible = true
    }
  },

  mounted () {
    // Hide modal when pressing the esc key
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        this.hideModal()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.modal {
  z-index: $index-modal;
  top: 0;
  left: 0;
}

.modal__background {
}

h1 {
  font-size: 7rem;
  font-weight: 700;
}

.video {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 50vw;
  height: 100%;
  video {
    height: 100%;
  }
}

.modal__window {
  z-index: 5;
  text-align: left;
  padding: 3rem;
  width: 80vw;
  height: 80vh;
}

</style>
