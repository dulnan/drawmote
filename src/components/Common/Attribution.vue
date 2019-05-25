<template>
  <div class="attribution">
    <div class="attribution-background"></div>
    <div class="attribution-overlay pdg md-pdg+ lg-pdg++">
      <div class="md-pdg++ attribution-content">
        <h2 class="text-heavy h1 mrgb">Attribution</h2>
        <p class="h2 mrgb+">
          drawmote was only made possible thanks to the contributions of the
          following people and projects.
        </p>

        <template v-for="section in sections">
          <div :key="section.name">
            <h3 class="h2 text-bold text-uppercase mrgb- mrgt++">
              {{ section.name }}
            </h3>
            <ul class="list">
              <li v-for="item in section.items" :key="item.name" class="mrgb">
                <div v-if="section.name === 'Media'">
                  <h4 class="h4 text-bold">
                    <a :href="item.link" class="link"
                      >"{{ item.description }}"</a
                    >
                  </h4>
                  by
                  <a :href="item.linkUser" class="link">{{ item.name }}</a> is
                  licensed under
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    class="link"
                    >CC BY 4.0</a
                  >
                </div>
                <div v-else>
                  <h4 class="text-bold">
                    <a :href="item.link" class="link">{{ item.name }}</a>
                  </h4>
                  <div>{{ item.description }}</div>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Attribution',

  data() {
    return {
      sections: [
        {
          name: 'Contributions',
          items: [
            {
              name: 'Pascal Thormeier',
              description:
                'Figured out and implemented the math for gyro-plane.',
              link: 'http://thormeier.github.io/'
            },
            {
              name: 'Sascha Aeppli',
              description: 'Support for various math and JavaScript questions.',
              link: 'https://github.com/munxar'
            }
          ]
        },

        {
          name: 'Libraries',
          items: [
            {
              name: 'simple-peer',
              description: 'Simple WebRTC video/voice and data channels',
              link: 'https://github.com/feross/simple-peer'
            },
            {
              name: 'gyronorm.js',
              description:
                'JavaScript project for accessing and normalizing the accelerometer and gyroscope data on mobile devices',
              link: 'https://github.com/dorukeker/gyronorm.js'
            },
            {
              name: 'Vue.js',
              description:
                'a progressive, incrementally-adoptable JavaScript framework for building UI on the web. ',
              link: 'https://github.com/vuejs/vue'
            },
            {
              name: 'three.js',
              description: 'JavaScript 3D library',
              link: 'https://github.com/mrdoob/three.js/'
            }
          ]
        },
        {
          name: 'Media',
          items: [
            {
              name: 'BenGreen',
              linkUser: 'https://sketchfab.com/antonystix',
              description: 'Smartphone | Low Poly | Free Download',
              link:
                'https://sketchfab.com/3d-models/smartphone-low-poly-free-download-36e8a127e2b9481ea7b4ed4187f2b765'
            },
            {
              name: "Daniel O'Neil",
              linkUser: 'https://sketchfab.com/doneil',
              description: 'Monitor w/Star Wars Animation: Household Props 4',
              link:
                'https://sketchfab.com/3d-models/monitor-wstar-wars-animation-household-props-4-8ca4aaaf438a44189443e34962a18cd5'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.attribution {
  z-index: $index-footer - 2;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  &.appear-enter-active,
  &.appear-leave-active {
    transition: 0.7s ease-in-out;
    .attribution-overlay {
      transition: 0.7s ease-in-out;
    }
  }
  &.appear-enter,
  &.appear-leave-to {
    opacity: 0;
    .attribution-overlay {
      transform: translateY(30%);
      @include media('sm') {
        transform: translateY(10%);
      }
    }
  }
}

.attribution-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.attribution-background {
  background: rgba($alt-color-darkest, 0.99);
}

.attribution-overlay {
  position: relative;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  z-index: $index-footer + 1;
  padding-bottom: 5rem !important;
  height: 100%;
  @include media('sm') {
    display: flex;
  }
  > div {
    max-width: 80rem;
    margin: 0 auto;
    @include media('sm') {
      overflow: hidden;
    }
  }

  table {
    tr {
      td {
        padding-left: 0;
        padding-right: 0;
      }
      td:first-child {
        width: 10rem;
      }
    }
  }

  > div {
  }
}

.attribution-content {
  overflow: auto;

  @include media('sm') {
    .list {
      display: flex;
      flex-wrap: wrap;
      li {
        flex: 0 0 50%;
      }
    }
  }
}
</style>
