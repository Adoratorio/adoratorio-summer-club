<template>
  <main>
    <transition @leave="leave" mode="out-in">
      <Intro
        js-trans="intro"
        v-if="gameplay.mode === null && $store.state.playHomeAnimation"
      />
    </transition>

    <transition @enter="enter" @leave="leave" mode="out-in">
      <section
        js-trans="home"
        v-if="$store.state.page === 'home' && gameplay.mode === null"
        :style="{ height: heightSection }"
      >
        <div class="bg-container">
          <div
            class="bg bg__choice"
            v-for="(data, key) in choices"
            :key="key"
            :style="{ backgroundColor : data.bg }"
            :class="`bg__choice--${key}`"
            ></div>
        </div>
        <div class="ui-container">
          <Choice
            v-for="(data, key) in choices"
            :key="key"
            :data="data"
            :class="[`choice--${key}`, !isAnimatedC ? 'animating' : false]"
          />
        </div>
      </section>
    </transition>

    <transition @enter="enter" @leave="leave" mode="out-in">
      <section
        js-trans="step"
        v-if="gameplay.mode === 'synced'"
        :style="{ height: heightSection }"
      >
        <div class="bg-container">
          <div
            class="bg bg__step"
            v-for="(data, key) in steps"
            :key="key"
            :style="{ backgroundColor : data.bg }"
            :class="`bg__${key}`"
            ></div>
        </div>

        <div class="ui-container">
          <Step
            v-for="(data, key) in steps"
            :key="key"
            :data="data"
            :class="key"
          />
        </div>
      </section>
    </transition>

    <transition @enter="enter" @leave="leave" mode="out-in">
      <section
        js-trans="touch"
        v-if="gameplay.mode === 'desktop' && $store.state.isMobile"
        :style="{ height: heightSection }"
      >
        <div class="bg-container">
          <div
            class="bg bg__step"
            v-for="(data, key) in touch"
            :key="key"
            :style="{ backgroundColor : data.bg }"
            :class="`bg__${key}`"
            ></div>
        </div>

        <div class="ui-container">
          <Step
            v-for="(data, key) in touch"
            :key="key"
            :data="data"
            :class="key"
          />
        </div>
      </section>
    </transition>

    <transition name="fade">
      <div
        class="step__back"
        v-if="($store.state.gameplay.mode === 'synced' || ($store.state.gameplay.mode === 'desktop' && $store.state.isMobile) && $store.state.page === 'home')"
      >
        <router-link to="/"
          @click.native="$store.commit('SET_PLAY_HOME_ANIMATION', false); $store.commit('SET_MODE', null)"
        >
          <bdi>b</bdi><bdi>a</bdi><bdi>c</bdi><bdi>k</bdi>
        </router-link>
      </div>
    </transition>

  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { TimelineLite, Power2 } from 'gsap/TweenMax';

import { qs, qsa, isMobileDevice } from '@/scripts/utils';
import animations from '@/scripts/animations';

import Choice from '@/components/Choice.vue';
import Step from '@/components/Step.vue';
import Intro from '@/components/Intro.vue';

export default {
  name: 'Home',

  components: {
    Choice,
    Step,
    Intro,
  },

  data() {
    return {
      choices: {
        solo: {
          id: 'solo',
          bg: '#151515',
          desktop: {
            title: '<bdi>K</bdi><bdi>e</bdi><bdi>y</bdi></br><bdi>b</bdi><bdi>o</bdi><bdi>a</bdi></br><bdi>r</bdi><bdi>d</bdi>',
            subtitle: 'Desktop',
            text: 'This game is based on rhythm and sound. Press <strong>A</strong> or <strong>D</strong> when <strong class="color--primary">orange</strong> <strong class="color--primary">words</strong> are <strong class="color--primary">almost</strong> <strong class="color--primary">fully</strong> <strong class="color--primary">coloured</strong> to increase your score!</br>Fingers ready, like in a pistol fight.',
          },
          mobile: {
            title: '<bdi>T</bdi><bdi>o</bdi><bdi>u</bdi></br><bdi>c</bdi><bdi>h</bdi>',
            subtitle: 'Mobile',
            text: 'This game is based on rhythm and sound.</br>Press the <strong>Left</strong> or <strong>Right</strong> button when <strong class="color--primary">orange</strong> <strong class="color--primary">words</strong> are <strong class="color--primary">fully</strong> <strong class="color--primary">coloured</strong> to increase your score!</br>Fingers ready, like in a pistol fight.',
          },
        },
        sync: {
          id: 'sync',
          bg: '#090909',
          desktop: {
            title: '<bdi>S</bdi><bdi>y</bdi><bdi>n</bdi></br><bdi>c</bdi><bdi>e</bdi><bdi>d</bdi><br><br>',
            subtitle: 'Desktop + Mobile',
            text: 'Thumbs up, Thumbs ready.<br>This function lets you follow the lyrics on your desktop while using your <strong class="color--primary">mobile</strong> as a <strong class="color--primary">controller!</strong>',
          },
          mobile: {
            title: '<bdi>S</bdi><bdi>y</bdi><bdi>n</bdi></br><bdi>c</bdi><bdi>e</bdi><bdi>d</bdi>',
            subtitle: 'Mobile + Desktop',
            text: 'Smartphones, Roll out!<br>Type the code found on the desktop website and start tapping on your new joystick!',
          },
        },
      },

      isAnimatedC: false,

      isMobileDevice,

      steps: {
        step01: {
          id: 'solo',
          bg: '#151515',
          desktop: {
            title: '<bdi>S</bdi><bdi>T</bdi><bdi>E</bdi><bdi>P</bdi><br><bdi class="number">0</bdi><bdi class="number">1</bdi>',
            subtitle: 'Desktop + Mobile',
            text: 'Grab your phone and type this address on your browser:',
            link: 'summerclub.adoratorio.studio',
          },
          mobile: {
            text: 'Grab your <strong>desktop</strong>, go to <a href="https://summerclub.adoratorio.studio" rel="noopener"><strong class="color--primary">summerclub.adoratorio.studio</strong></a> choose <strong class="color--primary">Synced</strong> and type the code here:',
            input: true,
          },
        },
        step02: {
          id: 'sync',
          bg: '#090909',
          desktop: {
            title: '<bdi>S</bdi><bdi>T</bdi><bdi>E</bdi><bdi>P</bdi><br><bdi class="number">0</bdi><bdi class="number">2</bdi>',
            subtitle: 'Desktop + Mobile',
            text: 'Then tap Synced and synchronize with this code:',
            code: 'Waiting for code <span class="dots"><bdi>.</bdi><bdi>.</bdi><bdi>.</bdi></span>',
          },
          mobile: {
            text: 'This is now your joystick. Press go to start playing!',
            btn: {
              type: 'button',
              content: 'GO',
            },
          },
          isAnimatedS: false,
        },
      },

      touch: {
        step01: {
          id: 'solo',
          bg: '#151515',
          mobile: {
            text: 'This game is based on rhythm and sound.</br>Press the <strong>Left</strong> or <strong>Right</strong> button when <strong class="color--primary">orange</strong> <strong class="color--primary">words</strong> are <strong class="color--primary">almost</strong> <strong class="color--primary">fully</strong> <strong class="color--primary">coloured</strong> to increase your score!',
          },
        },
        step02: {
          id: 'sync',
          bg: '#090909',
          mobile: {
            text: 'This is now your <strong>joystick</strong>. Press go to start playing!',
            btn: {
              type: 'button',
              content: 'GO',
            },
          },
          isAnimatedS: false,
        },
      },

    };
  },

  computed: {
    ...mapGetters({
      gameplay: 'gameplay',
    }),

    heightSection() {
      this.height = isMobileDevice() ? navigator.vendor === 'Apple Computer, Inc.' ? `${window.innerHeight - 80}px` : `${window.innerHeight}px` : '100vh'; // eslint-disable-line

      return this.height;
    },
  },

  mounted() {
    if (!this.$store.state.playHomeAnimation) {
      this.$store.commit('SET_PAGE', 'home');
    }

    window.addEventListener('orientationchange', this.orientationCangeHandle);
    window.addEventListener('resize', this.orientationCangeHandle);
  },

  methods: {
    orientationCangeHandle() {
      this.height = isMobileDevice() ? navigator.vendor === 'Apple Computer, Inc.' ? `${window.innerHeight - 80}px` : `${window.innerHeight}px` : '100vh'; // eslint-disable-line
    },

    enter(el, done) {
      const transitionName = el.getAttribute('js-trans');
      const tl = new TimelineLite({
        onComplete: () => {
          done();
          if (transitionName === 'home') {
            this.$store.commit('SET_PLAY_HOME_ANIMATION', true);
          }
        },
      });

      tl
        .add('start')
        .set(qs('.bg:first-child', el), {
          yPercent: 100,
        })
        .set(qs('.bg:last-child', el), {
          yPercent: -100,
        });

      if (transitionName === 'home') {
        qsa('.choice', this.$el).forEach((choice, index) => {
          const choiceAnimation = animations.get('home')(choice);

          choiceAnimation.addCallback(() => {
            this.isAnimatedC = true;
          }, choiceAnimation.duration() - 1);

          tl.add(choiceAnimation, (index * 0.2) + 0.4);
        });
      } else if (transitionName === 'step') {
        qsa('.step', this.$el).forEach((step, index) => {
          const stepAnimation = animations.get('step')(step);
          stepAnimation.eventCallback('onComplete', () => {
            this.steps.step02.isAnimatedS = true;
          });

          tl.add(stepAnimation, (index * 0.2) + 0.4);
        });
      } else if (transitionName === 'touch') {
        qsa('.step', this.$el).forEach((step, index) => {
          const stepAnimation = animations.get('step')(step);
          tl.add(stepAnimation, (index * 0.2) + 0.4);
        });
      }

      tl
        .staggerTo(qsa('.bg', el), 0.4, {
          yPercent: 0,
          ease: Power2.easeOut,
        }, 0.4, 'start+=0.1');
    },

    leave(el, done) {
      const transitionName = el.getAttribute('js-trans');

      if (transitionName === 'intro') {
        done();
      } else {
        const tl = new TimelineLite({
          onComplete: done,
        });

        tl
          .add('start')
          .staggerTo(qs('.bg:first-child', el), 0.4, {
            yPercent: -100,
            ease: Power2.easeOut,
          }, 'start')
          .to(qs('.bg:last-child', el), 0.4, {
            yPercent: 100,
            ease: Power2.easeOut,
          }, 'start+=0.1')
          .staggerTo(qsa('article', el), 0.4, {
            autoAlpha: 0,
            ease: Power2.easeOut,
          }, 0.1, 'start');
      }
    },
  },

  beforeDestroy() {
    window.removeEventListener('orientationchange', this.orientationCangeHandle);
    window.removeEventListener('resize', this.orientationCangeHandle);
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

main {
  position: relative;
  height: 100vh;

  overflow: hidden;
}

section {
  position: relative;
  padding-top: 80px;

  @include mq(sm) {
    padding-top: 140px;
  }

  @include mq($until: sm) {
    align-items: center;
  }

  z-index: 3;

  @extend %flex;

  .bg-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    z-index: 0;

    .bg {
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;

      &:first-child {
        left: 0;
      }

      &:last-child {
        left: 50%;
      }
    }
  }

  .ui-container {
    z-index: 1;

    @extend %flex;
  }

  .animating {
    pointer-events: none;
  }
}

.step__back {
  position: fixed;
  left: 50%;
  top: 30px;
  transform: translateX(-19px);
  font-weight: 500;

  overflow: hidden;
  z-index: 99;

  bdi {
    display: inline-block;
  }

  @include mq(sm) {
    top: 60px;
  }

  @at-root .pointerevents:not(.touchevents) &:hover,
  .no-pointerevents.no-touchevents &:hover {
    opacity: 1;
    bdi {
      animation: hoverFx 0.5s ease forwards;

      &:nth-child(1) { animation-delay: 0s }
      &:nth-child(2) { animation-delay: 0.02s }
      &:nth-child(3) { animation-delay: 0.04s }
      &:nth-child(4) { animation-delay: 0.06s }
      &:nth-child(5) { animation-delay: 0.08s }
    }
  }

  transition: color 0.3s ease;

  &:hover {
    color: $color-primary;
  }

  &.fade-enter-active, &.fade-leave-active {
    transition: opacity .5s ease-out;
  }
  &.fade-enter, &.fade-leave-to {
    opacity: 0;
  }
}

@keyframes hoverFx {
  0% {
    transform: translate3d(0, 0%, 0);
  }

  50% {
    transform: translate3d(0, -100%, 0);
  }

  51% {
    transform: translate3d(0, 100%, 0);
  }

  100% {
    transform: translate3d(0, 0%, 0);
    color: $color-primary;
  }
}
</style>
