<template>
  <article
    class="choice"
    @mousemove="setHover"
    @mouseleave="removeHover"
  >
    <div class="choice__wrapper">
      <div class="choice__inner">
        <h4
          ref="subtitle"
          v-html="data[device].subtitle"
          class="choice__subtitle"
        >
        </h4>
      </div>
      <h2
        ref="title"
        v-html="data[device].title"
        class="choice__title"
        @click="$store.state.isMobile ? data.id === 'solo' ? readyFn() : syncFn() : false"
      >
      </h2>
    </div>
    <p
      ref="text"
      v-html="data[device].text"
      class="choice__text"
      v-if="!$store.state.isMobile"
    >
    </p>

    <Button
      class="choice__btn"
      :data="btn"
      ref="btn"
      @click.native.prevent="data.id === 'solo' ? readyFn() : syncFn()"
      v-if="!$store.state.isMobile"
    />

    <div
      class="choice__controller"
      ref="controller"
      v-if="!$store.state.isMobileDevice"
    >
      <!-- eslint-disable -->
      <svg v-if="data.id === 'solo'"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 165">
        <g opacity=".15" fill="#FFF"><path d="M149 165H79V95h70v70zm-68-2h66V97H81v66z"/><path d="M122.2 121.6v3l-11.2 9.5h11.4v3.9h-18.7v-3l10.9-9.6h-10.7v-3.8h18.3z"/></g>
        <g opacity=".15" fill="#FFF"><path d="M226 165h-70V95h70v70zm-68-2h66V97h-66v66z"/><path d="M192.1 136h-5.3v-3.9h5.3v3.9zm0-21h-5.3v-3.9h5.3v3.9zm-3.9 10.2c.4-.7.7-1.5.8-2.2h-2.3v-3.9h5.3v3.2c0 .9-.5 2.1-1 2.8l-2.8.1z"/></g>
        <g opacity=".15" fill="#FFF"><path d="M70 165H0V95h70v70zm-68-2h66V97H2v66z"/><path d="M29.8 133.1v-3.5l10.3-3.5v3.3l-7 1.9 7 1.8v3.3l-10.3-3.3z"/></g>
      </svg>

      <button
        :class="['game__button', data.id === 'solo' ? 'game__button--dsk' : 'game__button--mbl']"
        ref="buttonLeft"
      >
        <span class="game__button-fill"></span>
        <span class="game__button-outline"></span>
        <p v-if="data.id === 'solo'">A</p>
      </button>
      <button
        :class="['game__button', data.id === 'solo' ? 'game__button--dsk' : 'game__button--mbl']"
        ref="buttonRight"
      >
        <span class="game__button-fill"></span>
        <span class="game__button-outline"></span>
        <p v-if="data.id === 'solo'">D</p>
      </button>
      <!-- eslint-enable -->
    </div>


  </article>
</template>

<script>
import { TweenMax, TimelineMax } from 'gsap/TweenMax';
import { isMobile, isMobileDevice } from '@/scripts/utils';
import socket from '@/scripts/socket';

import Button from '@/components/utils/Button.vue';

export default {
  name: 'Choice',

  components: {
    Button,
  },

  props: ['data'],

  data() {
    return {
      isMobile,
      btn: {
        type: 'button',
        content: 'GO',
        hover: true,
      },

      isHover: false,
      initBtn: null,
      tlButton: null,

      counter: 0,
    };
  },

  computed: {
    device() {
      return this.$store.state.isMobileDevice ? 'mobile' : 'desktop';
    },
  },

  mounted() {
    this.$refs.title.style.opacity = 0;
    this.$refs.subtitle.style.opacity = 0;

    if (!this.$store.state.isMobile) {
      this.$refs.text.style.opacity = 0;

      this.$nextTick(() => {
        TweenMax.set(this.$refs.btn.$el, {
          yPercent: 25,
          autoAlpha: 0,
        });
      });
    }

    if (!this.$store.state.isMobileDevice) {
      this.$refs.controller.style.opacity = 0;

      let delay = 2;
      if (this.data.id === 'solo') delay = 3;

      this.tlButton = this.animateButton(delay);
    }
  },

  methods: {
    readyFn() {
      this.$store.commit('SET_MODE', 'desktop');
      if (!this.$store.state.isMobile) {
        this.$store.commit('SET_ROOM_CODE', { code: null });
        this.$router.push('game');
      }
    },

    syncFn() {
      this.$store.commit('SET_MODE', 'synced');
      if (!this.$store.state.isMobileDevice) {
        socket.room()
          .then(() => {
            socket.connect(!isMobileDevice());
          })
          .catch((error) => {
            this.$store.commit('SET_MODAL', {
              status: true,
              message: error.message,
            });
          });
      }
    },

    setHover() {
      if (this.isHover) return;
      if (this.$store.state.isMobileDevice) return;

      this.isHover = true;

      this.tlButton.play();

      if (this.data.id === 'solo') {
        this.handlerBind = (e) => {
          if (e.keyCode === 65 || e.keyCode === 68) this.animateClick(e);
        };

        window.addEventListener('keydown', this.handlerBind);
      }
    },

    removeHover() {
      if (this.$store.state.isMobileDevice) return;
      this.isHover = false;

      this.tlButton.pause(0);

      if (this.data.id === 'solo') {
        window.removeEventListener('keydown', this.handlerBind);
      }
    },

    animateClick(e) {
      let el = null;

      if (e.keyCode === 65) {
        el = this.$refs.buttonLeft;
      } else if (e.keyCode === 68) {
        el = this.$refs.buttonRight;
      } else {
        return;
      }

      const outline = el.querySelector('.game__button-outline');
      const tl = new TimelineMax();

      tl.add('start')
        .fromTo(el, 0.1, {
          scale: 1,
        }, {
          scale: 0.9,
        }, 'start')
        .fromTo(outline, 0.1, {
          scale: 1.2,
          autoAlpha: 0,
        }, {
          scale: 1.4,
          autoAlpha: 0.25,
        }, 'start')
        .set(el, {
          clearProps: 'scale',
        }, 'start+=0.1')
        .set(outline, {
          clearProps: 'all',
        }, 'start+=0.1');
    },

    animateButton(delay) {
      const buttonL = this.$refs.buttonLeft;
      const fillL = buttonL.querySelector('.game__button-fill');

      const buttonR = this.$refs.buttonRight;
      const fillR = buttonR.querySelector('.game__button-fill');

      const tl = new TimelineMax({
        paused: true,
        repeat: -1,
        repeatDelay: delay,
      });

      tl.add('startLeft')
        .fromTo(buttonL, 0.25, {
          autoAlpha: 0.25,
        }, {
          autoAlpha: 1,
        }, 'startLeft')
        .fromTo(fillL, 0.25, {
          scale: 0,
        }, {
          scale: 1,
          autoAlpha: 1,
        }, 'startLeft')
        .add('resetRight')
        .set(buttonL, {
          clearProps: 'all',
          delay: 0.35,
        }, 'resetLeft')
        .set(fillL, {
          clearProps: 'all',
          delay: 0.35,
        }, 'resetLeft')

        .add('startRight')
        .fromTo(buttonR, 0.25, {
          autoAlpha: 0.25,
        }, {
          autoAlpha: 1,
        }, 'startRight+=2')
        .fromTo(fillR, 0.25, {
          scale: 0,
        }, {
          scale: 1,
          autoAlpha: 1,
        }, 'startRight+=2')
        .add('resetRight')
        .set(buttonR, {
          clearProps: 'all',
          delay: 0.35,
        }, 'resetRight')
        .set(fillR, {
          clearProps: 'all',
          delay: 0.35,
        }, 'resetRight');

      return tl;
    },
  },

  beforeDestroy() {
    window.clearInterval(this.interval);

    window.removeEventListener('keydown', this.handlerBind);
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

.choice {
  flex: 0 0 50%;
  max-width: 50%;
  max-height: 800px;
  @extend %flex;

  flex-flow: column nowrap;
  justify-content: space-between;

  @include mq(lg) {
    justify-content: flex-start;
  }

  @media only screen
  and (min-device-width: 1024px)
  and (max-device-width: 1366px)
  and (orientation: portrait)
  and (-webkit-min-device-pixel-ratio: 1.5) {
    margin-top: 80px;
  }

  &--solo {
    padding: 30px 65px 0 30px;

    @include mq(sm) {
      padding: 25px 65px 0 45px;
    }
    @include mq(md) {
      padding: 25px 90px 80px 45px;
    }
    @include mq(lg) {
      padding: 0 90px 80px 45px;
    }
    @include mq(xl) {
      padding: 25px 90px 80px 45px;
    }
  }

  &--sync {
    padding: 30px 30px 0 65px;

    @include mq(sm) {
      padding: 25px 45px 0 65px;
    }
    @include mq(md) {
      padding: 25px 45px 80px 90px;
    }
    @include mq(lg) {
      padding: 0 45px 80px 90px;
    }
    @include mq(xl) {
      padding: 25px 45px 80px 90px;
    }
  }

  &__wrapper {
    .choice--sync & {
      align-self: flex-end;
    }

    perspective: 400;
  }

  &__inner {
    position: relative;
    overflow: hidden;
    line-height: 1em;
    margin: 0 0 10px;

    .choice--sync & {
      text-align: right;
    }
  }

  &__subtitle {
    font-family: $font-family-base;
    font-size: font-size(s);
    font-weight: 500;
  }

  &__title {
    font-size: font-size(xxm);
    font-weight: 900;
    text-transform: uppercase;
    line-height: 0.9em;

    color: transparent;
    -webkit-text-stroke: 1px rgba($color-text, 0.2);

    transition: color 0.4s ease-out;

    @include mq(sm) {
      -webkit-text-stroke-width: 2px;
      margin: 0 0 45px;
    }

    @include mq(lg) {
      font-size: font-size(l);
    }

    .choice--sync & {
      text-align: right;
    }
  }

  @at-root .no-pointerevents.touchevents .choice__title,
  .no-pointerevents.no-touchevents .choice__title
   {
    -webkit-text-stroke: 0px;
    color: $color-primary;
  }

  &__text {
    max-width: 333px;
    min-height: 88px;
    margin: 0 0 45px 0;
    opacity: 0.5;

    .choice--solo & {
      align-self: flex-end;
    }
  }

  @at-root .no-pointerevents.touchevents .choice__text,
  .no-pointerevents.no-touchevents .choice__text {
    opacity: 1;
  }

  &__btn {
    min-width: 100%;
    text-align: left;

    .choice--solo & {
      align-self: flex-end;
    }

    .choice--sync & {
      align-self: flex-start;
    }

    @include mq(md) {
      min-width: 333px;
    }
  }

  &__controller {
    position: absolute;
    bottom: 0;

    pointer-events: none;
    z-index: -1;

    @include mq($until: xl) {
      display: none;
    }

    .choice--solo & {
      transform: translate3d(0px, 20%, 0);
      svg {
        position: absolute;
        bottom: 0;
        left: 0;

        width: 226px;

        transform: translate3d(-55px, 0, 0);
      }

      .game__button {
        margin-bottom: 73px;
      }

      .game__button + .game__button {
        margin-left: 7px;
      }
    }

    .choice--sync & {
      right: 0;
      transform: translate3d(0px, -46px, 0);

      .game__button + .game__button {
        margin-left: 35px;
      }
    }
  }

  @at-root .pointerevents:not(.touchevents) &:hover,
  .no-pointerevents.no-touchevents &:hover {
    .choice {
      &__title {
        color: $color-primary;
        -webkit-text-stroke-color: transparent;
      }

      &__text {
        opacity: 1;
      }
    }
  }
}

.game {
  &__button {
    display: inline-block;
    position: relative;
    width: 65px;
    height: 65px;

    background-color: transparent;
    border-color: $color-white;
    border-width: 2px;

    font-family: $font-family-h;
    font-size: 1.375rem;
    line-height: 1.375rem;

    opacity: 0.25;

    cursor: pointer;

    &.game__button--mbl {
      border-radius: 50%;

      span {
        border-radius: 50%;
      }
    }

    &:focus {
      outline: transparent;
    }

    &:active {
      border-style: solid;
    }

    .game__button-fill {
      display: inline-block;
      position: absolute;
      top: 4px;
      left: 4px;
      width: calc(100% - 8px);
      height: calc(100% - 8px);

      background-color: $color-white;

      transform: scale(0);

      pointer-events: none;
    }

    .game__button-outline {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background-color: transparent;
      border: 2px solid $color-white;
      opacity: 0;

      pointer-events: none;
    }

    p {
      mix-blend-mode: difference;
      pointer-events: none;
    }

    &--controller {
      padding: 80px 30px;
      height: 100%;
      justify-content: space-around;

      .game__button {
        width: 162px;
        height: 162px;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        background: $color-dark;

        z-index: -1;
      }
    }
  }
}

</style>

<style lang="scss">
@import '../style';

.choice__btn {
  a {
    @at-root .pointerevents:not(.touchevents) &:hover span,
    .no-pointerevents.no-touchevents &:hover span {
      transform: translateY(-10px);
    }
    @at-root .pointerevents:not(.touchevents) &:hover::after,
    .no-pointerevents.no-touchevents &:hover::after {
      transform: translateY(-5px);
      opacity: 0.5;
    }

    @at-root .pointerevents:not(.touchevents) &:hover::before,
    .no-pointerevents.no-touchevents &:hover::before {
      opacity: 0.25;
    }
  }
}

.choice__title {
  bdi {
    display: inline-block;
  }
}

.choice {
  @at-root .no-pointerevents.touchevents,
  .no-pointerevents.no-touchevents {
    .choice__btn a,
    .choice__btn p {
      color: $color-primary;
      -webkit-text-stroke: 0px;

      &::before, &::after {
        -webkit-text-stroke-color: $color-primary;
      }
    }
  }

  @at-root .pointerevents:not(.touchevents) &:hover {
    .choice__btn[data-hover],
  .no-pointerevents.no-touchevents &:hover
  .choice__btn[data-hover] {
      a,
      p {
        color: $color-primary;
        -webkit-text-stroke: 0px;

        &::before, &::after {
          -webkit-text-stroke-color: $color-primary;
        }
      }
    }
  }
}
</style>

