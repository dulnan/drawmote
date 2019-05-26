<template>
  <div class="server-status">
    <div class="server-status__code">{{ serverStatus.status }}</div>
    <div class="server-status__text">
      <span class="text-bold">{{ serverStatus.statusText }}:</span>
      {{ description }}
      <a href="https://github.com/dulnan/drawmote/issues/new" class="link">
        create an issue on GitHub.
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ServerStatus',

  computed: {
    ...mapState(['serverStatus']),

    description() {
      if (this.serverStatus.status === 429) {
        return 'If you think something is fishy about that, '
      }

      return 'The server might be down or something else went wrong. If you want you can '
    }
  }
}
</script>

<style lang="scss">
.server-status {
  background: rgba($color-red, 0.2);
  border: 1px solid $color-red;
  width: 7em;
  max-width: 100%;
  z-index: 10;
  border-radius: 0.1em;
  display: flex;
  align-items: center;
  height: 1em;
  padding: 0 0.2em;
  @include media('sm') {
  }
}

.server-status__text {
  font-size: 0.25em;
  line-height: 1.25;
}

.server-status__code {
  font-weight: bold;
  font-size: 0.65em;
  line-height: 1.2;
  margin-top: -0.05em;
  margin-right: 0.3em;
}
</style>
