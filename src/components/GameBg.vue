<template>
  <section class="game__bg">
    <div class="bg__stripes-cont">
      <span class="bg__stripe" v-for="(number, index) in 12" :key="index">
      </span>
    </div>

    <div class="bg__text-cont"></div>

    <div class="progress-bar" v-show="!$store.state.gameplay.loader">
      <span class="progress-bar__fill" ref="progress"></span>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { TweenMax, TimelineMax } from 'gsap/TweenMax';

import socket from '@/scripts/socket';

import { qsa, qs, createNodes, isMobileDevice } from '@/scripts/utils';
import animationsBg from '@/scripts/animationsBg';
import animationsTexts from '@/scripts/animationsTexts';

import dataAnimation from '@/assets/data/texts.json';

export default {
  name: 'GameBg',

  data() {
    return {
      stripesContainer: null,
      stripes: null,

      dataAnimation,

      baseColor: ['#0b0b0b', '#101010', '#151515', '#1b1b1b', '#212121', '#272727', '#282828', '#222222', '#1c1c1c', '#171717', '#111111', '#0b0b0b'],

      gameTl: null,

      score: {
        score: 0,
        range: 0,
        sound: null,
        obj: 'icecream',
      },
    };
  },

  props: ['selectSound'],

  computed: {
    ...mapGetters({
      gameStatus: 'pause',
      loaderStatus: 'loader',
    }),

    ...mapGetters(['gameState']),
  },

  watch: {
    gameStatus(newVal) {
      if (!this.$store.state.gameplay.loader) {
        if (!newVal) {
          this.gameTl.play();
          this.progressGameTl.play();
        } else {
          this.gameTl.pause();
          this.progressGameTl.pause();
        }
      }
    },

    loaderStatus(newVal) {
      if (newVal) {
        const el = qs('.bg__text-cont', this.$el)
        el.innerHTML = '';
        this.progressGameTl.pause(0);
        this.gameTl.pause(0);

        this.setEls();
        this.setBgColor();

        this.createTexts();
        this.introAnimation();

        this.animation();
      }
    },
  },

  mounted() {
    this.init();
  },

  beforeDestroy() {
    this.progressGameTl.kill();
    this.gameTl.kill();
  },

  methods: {
    init() {
      this.setEls();
      this.setBgColor();

      this.introAnimation();
      this.createTexts();


      this.animation();
      this.progressGameTl = new TimelineMax({ paused: true });
      this.progressGameTl.to(this.$refs.progress, this.gameTl.duration(), {
        transformOrigin: '0 50%',
        scaleX: 1,
      });
    },

    setEls() {
      this.stripesContainer = qs('.bg__stripes-cont', this.$el);
      this.stripes = qsa('.bg__stripe', this.$el);
      this.stripesCover = qsa('.bg__stripes-cover', this.$el);
      this.textContainer = qs('.bg__text-cont', this.$el);

      this.stripes.forEach((el, i) => { TweenMax.set(el, { scaleY: 0, transformOrigin: i % 2 ? '50% 0%' : '50% 100%' }); });
      TweenMax.set(this.stripesCover, { scaleX: 0, transformOrigin: '50% 50%' });
      TweenMax.set(this.stripesContainer, { clearProps: 'all' });

      TweenMax.set(qsa('bdi', this.textContainer), {
        background: '-moz-linear-gradient(to right, #ff5829 0%, #ffffff 0%)',
        background: 'linear-gradient(to right, #ff5829 0%, #ffffff 0%)',
      });
    },

    setBgColor() {
      this.stripes.forEach((el, index) => {
        el.style.backgroundColor = this.baseColor[index];
      });
    },

    introAnimation() {
      animationsBg.get('intro')(this.stripesContainer, this.stripes, this.$store.state.gameplay.mode);
    },

    createTexts() {
      this.dataAnimation.forEach((el, index) => {
        el.animationTexts.forEach((animObj, i) => {
          createNodes(this.textContainer, animObj.nodes, animObj.type, index, i, animObj.animation.init);
        });
      });
    },

    animation() {
      const objCtx = {
        container: this.stripesContainer,
        stripes: this.stripes,
        colors: this.baseColor,
      };

      this.gameTl = new TimelineMax({
        paused: true,
        onComplete: () => {
          setTimeout(() => {
            this.$router.push({ name: 'score', params: this.getScore() });
            this.$store.commit('SET_GAME_STATE', this.gameState);

            if (this.$store.state.gameplay.mode === 'synced') socket.endGame(this.getScore());
          }, 500);
        },
      });

      this.dataAnimation.forEach((el, index) => {
        const elements = qsa(`[js-indexgroup="${index}"]`, this.$el);
        const label = `group${index}`;

        this.gameTl.addLabel(label);

        el.animationBg.forEach((anim) => {
          this.gameTl.add(animationsBg.get(anim.name)(objCtx, anim), `${label}${anim.pos}`);
        });

        el.animationTexts.forEach((anim, i) => {
          const element = elements[i];
          const startPos = `${label}${anim.animation.posIn}`;
          const endPos = `${label}${anim.animation.posOut}`;

          this.gameTl.add(animationsTexts.get(anim.animation.in)(element, anim.animation), startPos);
          this.gameTl.add(animationsTexts.get(anim.animation.out)(element, anim.animation), endPos);
        });

        if (el.animationFill !== undefined) {
          let elToFill = [];

          elements.forEach((nodeText) => {
            if (qs('bdi', nodeText) !== null && qs('bdi', nodeText) !== undefined) {
              elToFill = qsa('bdi', nodeText);
            }
          });

          elToFill.forEach((elToAnim, i) => {
            const fx = el.animationFill[i].sound;
            this.gameTl.add(this.animateText(elToAnim, el.animationFill[i], fx), `${label}${el.animationFill[i].pos}`);
          });
        }
      });

      return this.gameTl;
    },

    animateText(el, props, fx) {
      let delay = 0.35;

      if (props.position === 'left') {
        delay = this.$store.state.gameplay.mode === 'synced' ? (delay + 0.3) : isMobileDevice() ? (delay + 0.12) : (delay + 0.05);
      } else if (props.position === 'right') {
        delay = this.$store.state.gameplay.mode === 'synced' ? (delay + 0.25) : isMobileDevice() ? (delay + 0.08) : delay;
      }

      const tl = new TimelineMax({
        onStart: () => {
          this.$store.commit('SET_VALID', { position: props.position, state: 'error' });
        },
        onComplete: () => {
          this.gameState.counter += 1;
          if (this.gameState.counter !== (this.gameState.correct + this.gameState.error + this.gameState.fold)) {
            this.gameState.fold += 1;
            this.gameState.combo = 0;
            this.gameState.level = 0;
          }
        },
      });

      tl.addLabel('start')
        .fromTo(el, 0.25, {
          background: `linear-gradient(to right, #ff5829 0%, ${props.colorStart} 0%)`,
        }, {
          background: `-moz-linear-gradient(to right, #ff5829 99.99%, ${props.colorStart} 99.9%)`,
          background: `linear-gradient(to right, #ff5829 99.99%, ${props.colorStart} 99.9%)`,
        }, 'start')
        .addCallback(() => {
          this.selectSound(fx);
          this.$store.commit('SET_VALID', { position: props.position, state: 'correct' });
        }, 'start+=0.15')
        .to(el, 0.01, {
          background: props.colorEnd,
          webkitTextStroke: '0px',
          onComplete: () => {
            this.$store.commit('SET_VALID', { position: props.position, state: 'error' });
          },
        }, `start+=${delay}`)
        .addCallback(() => {
          this.$store.commit('SET_VALID', { position: props.position, state: 'uncorrect' });
        }, 'start+=1');

      return tl;
    },

    getScore() {
      this.score.score = Math.floor((this.gameState.correct / this.gameState.counter) * 100);

      switch (true) { // eslint-disable-line
        case (this.score.score < 21):
          this.score.obj = 'icecream';
          this.score.range = 0;
          this.score.sound = 'lose';
          break;

        case (this.score.score < 41):
          this.score.obj = 'donut';
          this.score.range = 1;
          this.score.sound = 'lose';
          break;

        case (this.score.score < 61):
          this.score.obj = 'banana';
          this.score.range = 2;
          this.score.sound = 'lose';
          break;

        case (this.score.score < 81):
          this.score.obj = 'crocodile';
          this.score.range = 3;
          this.score.sound = 'win-2';
          break;

        case (this.score.score > 80):
          this.score.obj = 'flamingo';
          this.score.range = 4;
          this.score.sound = 'win-2';
          break;

        case (this.score.score === 100):
          this.score.sound = 'win';
          break;
      }

      return this.score;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

.game__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  overflow: hidden;

  background-color: #151515;

  .bg__stripes-cont {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: stretch;
    justify-content: flex-start;

    background-color: #151515;
  }

  .bg__stripe {
    position: relative;
    flex: 1 1 auto;
  }

  .bg__text-cont {
    position: absolute;
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    white-space: nowrap;
  }

  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);

    z-index: 20;

    @include mq(md) {
      top: auto;
      bottom: 0;
    }

    &__fill {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6px;

      background-color: $color-primary;

      transform: scaleX(0);
    }
  }
}
</style>

<style lang="scss">
@import '../style';

.text-cont {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  @include mq($until: sm) {
    top: calc(50% - 20px);
  }

  font-size: 3rem;
  font-weight: bold;

  @include mq(sm) {
    font-size: 4rem;
  }

  @include mq(sm, $and: '(orientation: landscape)') {
    font-size: 4.5rem;
  }

  @include mq(md) {
    font-size: 4.5rem;
  }

  @include mq(xl) {
    font-size: 6.25rem;
  }

  div bdi,
  div div bdi {
    position: relative;
    display: inline-block;
    -webkit-text-stroke: 1px $color-primary;
    color: transparent;

    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent;

    white-space: nowrap;

    @include mq(sm) {
      -webkit-text-stroke-width: 2px;
    }
  }

  &.text--close-column {
    height: calc(100vh + 20px);
    line-height: calc(100vh + 20px);

    @include mq(md) {
      height: 100vh;
      line-height: 100vh;
    }

    div {
      display: inline-block;
      position: relative;
      padding: 0 5px;
      margin-left: -1px;

      white-space: nowrap;
    }
  }

  &.text--column {
    height: calc(100vh + 20px);
    line-height: calc(100vh + 20px);

    @include mq(md) {
      height: 100vh;
      line-height: 100vh;
    }

    div {
      display: inline-block;
      position: relative;
      padding: 0 5px;

      white-space: nowrap;
    }
  }

  &.text--column-rotation {
    height: calc(100vh + 20px);
    line-height: calc(100vh + 20px);

    @include mq(md) {
      height: 100vh;
      line-height: 100vh;
    }

    div {
      display: inline-block;
      position: relative;
      padding: 0 10px;

      white-space: nowrap;
    }
  }

  &.text--box {
    div {
      margin: 0 5px;
      padding: 10px 5px;
      display: inline-block;
      position: relative;

      white-space: nowrap;
    }
  }
}
</style>
