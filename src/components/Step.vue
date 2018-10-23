<template>
  <article
    class="step"
  >
    <div
      class="step__wrapper step--desktop"
      v-if="!$store.state.isMobileDevice"
    >
      <div class="step__inner">
        <h4
          ref="subtitle"
          v-html="data[device].subtitle"
          class="step__subtitle"
          v-if="!$store.state.isMobileDevice"
        >
        </h4>
      </div>
      <h2
        ref="title"
        v-html="data[device].title"
        class="step__title"
      >
      </h2>
    </div>
    <div
      class="step__text step--desktop"
      v-if="!$store.state.isMobileDevice"
    >
      <div class="step__inner">
        <p
          v-html="data[device].text"
          ref="text"
        >
        </p>
      </div>
      <h4
        v-if="data[device].link"
        v-html="data[device].link"
        class="step__link"
        ref="link"
      >
      </h4>

      <div
        v-if="data[device].code"
        class="step__inner"
      >
        <h4
          ref="code"
          v-html="data[device].code"
          class="step__code wait"
        >
        </h4>
      </div>
    </div>

    <div
      class="step__text step--mobile"
      v-if="$store.state.isMobileDevice"
    >
      <div class="step__inner">
        <p
          v-html="data[device].text"
          ref="text"
        >
        </p>
      </div>
      <div
        ref="input"
        v-if="data[device].input"
        class="step__input"
      >
        <input
          id="inputCode"
          type="text"
        />
      </div>

      <Button
        ref="btn"
        class="step__btn"
        :data="data[device].btn"
        v-if="data[device].btn"
        @click.native.prevent="gameplay.mode === 'synced' ? syncingFn() : readyFn()"
      />
    </div>

  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import { TweenMax, Elastic } from 'gsap/TweenMax';

import socket from '@/scripts/socket';
import { isMobile, isMobileDevice } from '@/scripts/utils';

import Button from '@/components/utils/Button.vue';

export default {
  name: 'step',

  props: ['data'],

  components: {
    Button,
  },

  data() {
    return {
      isMobile,
      isMobileDevice,
      isClicked: false,
    };
  },

  computed: {
    ...mapGetters({
      roomCode: 'roomCode',
      controllerConnected: 'controllerConnected',
      modalStatus: 'modalStatus',
      gameplay: 'gameplay',
    }),

    device() {
      return this.$store.state.isMobileDevice ? 'mobile' : 'desktop';
    },
  },

  watch: {
    roomCode(newVal) {
      if (newVal !== null && this.data[this.device].code !== undefined && !this.$store.state.isMobileDevice) {
        if (this.data.isAnimatedS) {
          this.showCode(newVal);
        } else {
          const interval = setInterval(() => {
            if (this.data.isAnimatedS) {
              this.showCode(newVal, interval);
            }
          }, 1500);
        }
      }
    },

    controllerConnected(newVal) {
      if (newVal && !this.$store.state.isMobileDevice) {
        this.$router.push({
          name: 'game',
          params: {
            room: this.roomCode,
            synced: true,
          },
        });
      }
    },

    modalStatus(newVal, oldVal) {
      if (!newVal && oldVal) this.isClicked = false;
    },
  },

  mounted() {
    if (!this.$store.state.isMobileDevice) {
      this.$refs.title.style.opacity = 0;
      if (this.$refs.link) this.$refs.link.style.opacity = 0;
      if (this.$refs.code) this.$refs.code.style.opacity = 0;
      if (this.$refs.subtitle) this.$refs.subtitle.style.opacity = 0;
    } else {
      if (this.$refs.input) this.$refs.input.style.opacity = 0;
      if (this.$refs.btn) this.$refs.btn.$el.style.opacity = 0;
    }
    this.$refs.text.style.opacity = 0;
  },

  methods: {
    showCode(newVal, loop) {
      TweenMax.to(this.$refs.code, 0.4, {
        transformOrigin: '0 100%',
        autoAlpha: 0,
        skewY: 10,
        ease: Elastic.easeOut.config(0.5, 0.75),
        onComplete: () => {
          this.$refs.code.classList.remove('wait');
          this.$refs.code.innerHTML = newVal;

          TweenMax.to(this.$refs.code, 0.4, {
            autoAlpha: 1,
            skewY: 0,
            delay: 0.2,
            ease: Elastic.easeOut.config(0.5, 0.75),
            clearProps: 'all',

            onComplete: () => {
              if (loop !== undefined) clearTimeout(loop);
            },
          });
        },
      });
    },

    readyFn() {
      this.$store.commit('SET_MODE', 'desktop');
      this.$store.commit('SET_ROOM_CODE', { code: null });
      this.$router.push('game');
    },

    syncingFn() {
      const code = document.getElementById('inputCode');
      if (code.value !== '' && !this.isClicked) {
        this.$store.commit('SET_MODE', 'synced');
        this.$store.commit('SET_ROOM_CODE', { code: code.value });

        this.isClicked = true;

        socket.connect(false)
          .then(() => {
            this.$router.push({
              name: 'game',
              params: {
                room: this.roomCode,
                synced: true,
              },
            });
          })
          .catch((error) => {
            this.$store.commit('SET_MODAL', {
              status: true,
              message: error.message,
            });
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

.step {
  flex: 0 0 50%;
  @extend %flex;

  flex-direction: column;
  align-self: center;

  &.step01 {
    padding: 25px 30px 0 30px;

    @include mq(sm) {
      padding: 30px 65px 0 45px;
    }
    @include mq(lg) {
      padding: 0 90px 140px 45px;
    }
  }

  &.step02 {
    padding: 30px 30px 0 30px;

    @include mq(sm) {
      padding: 30px 45px 0 60px;
    }
    @include mq(lg) {
      padding: 0 45px 140px 90px;
    }
  }

  &__wrapper {
    perspective: 400;
  }

  &__inner {
    position: relative;
    overflow: hidden;
    line-height: 1em;
    margin: 0 0 10px;
  }

  &__title {
    font-size: font-size(l);
    font-weight: 900;
    text-transform: uppercase;
    line-height: 0.9em;

    color: transparent;
    -webkit-text-stroke: 1px $color-white;

    margin: 0 0 120px;

    transition: color 0.4s ease-out;

    @include mq(sm) {
      -webkit-text-stroke-width: 2px;
    }
  }

  &__text {
    margin: 0;
    font-weight: 500;
    min-height: 100px;

    @extend %flex;
    align-items: baseline;
  }

  &__subtitle {
    font-family: $font-family-base;
    font-size: font-size(s);
    font-weight: 500;
  }

  &__link, &__code, &__input, &__btn {
    flex: 0 0 100%;
    color: $color-primary;
    font-weight: 500;
    font-family: $font-family-base;
    font-size: font-size(m);
  }

  &__link {
    font-size: 1.5rem;
    line-height: 54px;

    @include mq(lg) {
      font-size: 2rem;
    }
  }

  &__btn {
    margin-top: 10px;
    text-align: left;
  }

  &__input {
    position: relative;
    max-width: 140px;

    input {
      width: 100%;
      appearance: none;
      border: 0;
      margin: 0;
      padding: 0;
      outline: transparent;
      background: transparent;

      color: $color-primary;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 1px;

      background: $color-primary;
    }
  }

  &__inner {
    position: relative;
    flex: 0 0 100%;
    overflow: hidden;
  }

  &__code.wait {
    font-family: $font-family-base;
    color: $color-white;
    font-size: font-size(s);
  }
}
</style>

<style lang="scss">
@import '../style';

.step__title {
  bdi {
    display: inline-block;

    &.number {
      -webkit-text-stroke: 0px;
      color: $color-primary;
    }
  }
}

.step__code {
  .dots {
    letter-spacing: 1px;
    bdi {
      animation-name: blink;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-fill-mode: both;

      &:nth-child(2) {
        animation-delay: .2s;
      }

      &:nth-child(3) {
        animation-delay: .4s;
      }
    }
  }
}

@keyframes blink {
  0% {
    opacity: .2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: .2;
  }
}
</style>

