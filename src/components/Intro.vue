<template>
  <section class="intro">
    <div class="intro__getready">
      <div class="intro__getready--get"><h2>Get</h2></div>
      <div class="intro__getready--ready"><h2>Ready</h2></div>
    </div>

    <div class="intro__logo">
      <h1 class="intro__logo--left">
        <div><bdi class="fill">Adora</bdi></div>
        <div><bdi class="outline">Adora</bdi></div>
        <div class="anim--top"><bdi class="fill">Torio</bdi></div>
        <div><bdi class="outline">Torio</bdi></div>

        <span class="intro__motion motion1">Adora<br>Torio</span>
        <span class="intro__motion motion2">Adora<br>Torio</span>
        <span class="intro__motion motion3">Adora<br>Torio</span>
      </h1>
      <h1 class="intro__logo--right">
        <div><bdi class="outline">Summer</bdi></div>
        <div class="anim--bottom"><bdi class="fill">Summer</bdi></div>
        <div><bdi class="outline">Club</bdi></div>
        <div><bdi class="fill">Club</bdi></div>

        <span class="intro__motion motion1">Summer<br>Club</span>
        <span class="intro__motion motion2">Summer<br>Club</span>
        <span class="intro__motion motion3">Summer<br>Club</span>
      </h1>
    </div>

    <Button
      class="intro__btn"
      :data="btn[device]"
      ref="btn"
    />

    <HeadphonesModal />
  </section>
</template>

<script>
import { TimelineLite, Power2 } from 'gsap/TweenMax';
import { qs } from '@/scripts/utils';
import animations from '@/scripts/animations';

import Button from '@/components/utils/Button.vue';
import HeadphonesModal from '@/components/HeadphonesModal.vue';

export default {
  name: 'Intro',

  components: {
    Button,
    HeadphonesModal,
  },

  data() {
    return {
      btn: {
        desktop: {
          type: 'hold',
          content: 'CLICK & HOLD',
        },
        mobile: {
          type: 'hold',
          content: 'TAP & HOLD',
        },
      },

      timer: null,
      tlHold: null,
      hold: false,

      loopCheck: false,
      press: false,
    };
  },


  computed: {
    device() {
      return this.$store.state.isMobileDevice ? 'mobile' : 'desktop';
    },
  },

  mounted() {
    animations.get('loader')(this.$el).play();

    if (this.$store.state.page !== 'home') {
      animations.get('intro')(this.$el).addCallback(() => {
        this.addMouseDown(this.$el);
      }).play();
    }

    this.tlHold = new TimelineLite({ paused: true });
    this.tlHold
      .add('start')
      .to('.holdon', 2, {
        background: 'linear-gradient(to right, #ff5829 100%, #000000 200%)',
        ease: Power2.easeIn,
      }, 'start')
      .to('.outline', 1.3, {
        opacity: 0,
        ease: Power2.easeInOut,
      }, 'start')
      .to('.anim--top', 0.5, {
        yPercent: -100,
        ease: Power2.easeInOut,
      }, 'start+=1')
      .to('.anim--bottom', 0.5, {
        yPercent: 100,
        ease: Power2.easeInOut,
      }, 'start+=1');
  },

  methods: {
    addMouseDown(el) {
      this.handleMouseDown = () => this.mouseDown();
      this.handleMouseUp = this.mouseUp.bind(this);

      this.handleKeyDown = (event) => {
        if (event.keyCode === 32) {
          if (!this.press) {
            this.mouseDown();
            this.press = true;
          }
        }
      };

      this.handleKeyUp = (event) => {
        if (event.keyCode === 32) {
          this.press = false;
          this.handleMouseUp();
        }
      };

      el.addEventListener('mousedown', this.handleMouseDown);
      el.addEventListener('mouseup', this.handleMouseUp);

      el.addEventListener('touchstart', this.handleMouseDown);
      el.addEventListener('touchend', this.handleMouseUp);

      document.addEventListener('keypress', this.handleKeyDown);
      document.addEventListener('keyup', this.handleKeyUp);
    },

    removeMouseDown(el) {
      el.removeEventListener('mousedown', this.handleMouseDown);
      el.removeEventListener('mouseup', this.handleMouseUp);
    },

    mouseDown() {
      if (this.$store.state.track !== null) {
        this.$store.state.track.play();
        this.$store.state.track.once('play', () => {
          this.$store.state.track.stop();
        });
      }

      if (this.$store.state.fx.get('error') !== null) {
        this.$store.state.fx.get('error').volume(0).play();
        this.$store.state.fx.get('error').once('play', () => {
          this.$store.state.fx.get('error').stop();
        });
      }

      if (this.$store.state.loop !== null && !this.loopCheck) {
        this.loopCheck = true;
        this.$store.state.loop.play();
        this.$store.state.loop.fade(0.0, 0.3, 3000);
      }

      this.tlHold.timeScale(2).play();
      this.timer = setTimeout(() => {
        this.hold = true;

        const tl = new TimelineLite({
          onComplete: () => {
            this.$store.commit('SET_PAGE', 'home');
          },
        });

        tl
          .add('start')
          .to(this.$refs.btn.$el, 0.3, {
            autoAlpha: 0,
            ease: Power2.easeInOut,
          }, 'start')
          .to('.intro__logo h1 bdi', 1, {
            skewX: 30,
            ease: Power2.easeOut,
          }, 'start')
          .to('.intro__motion.motion1', 1, {
            autoAlpha: 0.4,
            ease: Power2.easeOut,
          }, 'start')
          .to('.intro__motion.motion2', 1, {
            autoAlpha: 0.25,
            ease: Power2.easeOut,
          }, 'start')
          .to('.intro__motion.motion3', 1, {
            autoAlpha: 0.15,
            ease: Power2.easeOut,
          }, 'start')
          .to('.intro__logo--left', 1, {
            x: ((window.innerWidth / 2) + qs('.intro__logo--left').getBoundingClientRect().width) * -1,
            autoAlpha: 0,
            ease: Power2.easeInOut,
          }, 'start')
          .to('.intro__logo--right', 1, {
            x: (window.innerWidth / 2) + qs('.intro__logo--right').getBoundingClientRect().width,
            autoAlpha: 0,
            ease: Power2.easeInOut,
          }, 'start')
          .staggerTo('.intro__getready > div', 0.75, {
            yPercent: 0,
            autoAlpha: 1,
            ease: Power2.easeInOut,
            clearProps: 'all',
          }, 0.3, 'start+=0.75')
          .staggerTo('.intro__getready h2', 0.75, {
            skewY: 0,
            skewX: 0,
            rotationX: 0,
            ease: Power2.easeInOut,
            clearProps: 'all',
          }, 0.3, 'start+=0.75');
      }, 1000);
    },

    mouseUp() {
      if (!this.hold) this.tlHold.timeScale(2).reverse();
      clearTimeout(this.timer);
    },
  },

  beforeDestroy() {
    if (!this.$store.state.isMobileDevice) this.removeMouseDown(this.$refs.btn.$el);

    document.removeEventListener('keypress', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

.intro {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  background: $color-bg;

  padding-top: 0;

  z-index: 1;

  cursor: pointer;

  @extend %flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  flex-wrap: nowrap;

  @include mq(xs) {
    height: 100vh;
  }

  &__logo {
    position: relative;
    width: 100%;
    @extend %flex;

    & > h1 > div {
      overflow: hidden;
    }

    h1 {
      position: relative;
      font-size: font-size(m);
      text-transform: uppercase;
      font-weight: 900;
      line-height: 1em;

      flex: 0 0 50%;

      @include mq(md) {
        font-size: font-size(xxm);
      }

      @include mq(xl) {
        font-size: font-size(l);
      }

      &:first-child {
        text-align: right;

        .intro__motion {
          top: 0;
          right: 0;
          text-align: right;
        }
      }

      &:last-child {
        text-align: left;

        .intro__motion {
          bottom: 0;
          left: 0;
          text-align: left;
        }
      }

      bdi {
        position: relative;
        display: inline-block;

        &.outline {
          color: transparent;
          -webkit-text-stroke: 1px $color-text;

          @include mq(sm) {
            -webkit-text-stroke-width: 2px;
          }
        }
      }

      .intro__motion {
        display: inline-block;
        position: absolute;

        &:nth-of-type(1) {
          transform: translate3d(-20px, 0, 0) skewX(-5deg);
        }

        &:nth-of-type(2) {
          transform: translate3d(20px, 0, 0) skewX(-5deg);
        }

        &:nth-of-type(3) {
          transform: translate3d(40px, 0, 0) skewX(-5deg);
        }
      }
    }
  }

  &__btn {
    margin-top: 40px;
  }

  &__getready {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    & > div {
      position: absolute;
      left: 0;
      width: 100%;
      height: 50%;

      text-align: center;

      @extend %flex;

      justify-content: center;

      h2 {
        font-size: font-size(xxm);
        font-family: $font-family-h;
        font-weight: 900;
        text-transform: uppercase;
        line-height: 1em;

        @include mq(md) {
          font-size: font-size(xl);
        }

        @include mq(xl) {
          font-size: font-size(xxl);
        }
      }
    }

    &--get {
      top: 0;
      align-items: flex-end;
      h2 {
        color: transparent;
        -webkit-text-stroke: 1px $color-text;

        @include mq(sm) {
          -webkit-text-stroke-width: 2px;
        }
      }
    }

    &--ready {
      top: 50%;
      h2 {
        color: $color-primary;
      }
    }
  }
}
</style>

<style lang="scss">
@import '../style';

.intro__btn p {
  @include mq($until: md) {
    font-size: 1.75rem !important;
  }

  @include mq($until: sm) {
    font-size: 1.43rem !important;
  }
}
</style>
