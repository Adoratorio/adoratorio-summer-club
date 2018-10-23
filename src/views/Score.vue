<template>
  <main class="score" v-if="this.$route.params.score !== undefined">
    <section class="ui-container">
      <div class="score__placeholder"></div>
      <h2
        ref="text"
        class="score__text"
        v-html="score[$route.params.range].text"
      ></h2>
      <h2
        ref="result"
        class="score__result"
      >
        <div class="result"></div>
        %
      </h2>
      <Button
        :data="btn"
        ref="btnD"
        class="score__btn"
        @click.native="$store.state.gameplay.sync.roomCode !== null ? redirectHome() : false"
      />
      <div class="share-container" v-if="this.$store.state.gameplay.sync.roomCode === null || !isMobileDevice()">
        <a target="_blank" :href="this.getShareUrl('facebook')">
          <div class="share share--facebook">
            <svg viewBox="0 0 11 34" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g stroke="none">
                <g class="bring-down" fill="#FF5829" fill-rule="nonzero">
                  <g>
                    <path d="M2.51248375,4.4892132 C2.51248375,5.07332278 2.51248375,7.68044861 2.51248375,7.68044861 L0.182285714,7.68044861 L0.182285714,11.5827036 L2.51248375,11.5827036 L2.51248375,23.1788333 L7.29920518,23.1788333 L7.29920518,11.583027 L10.5113175,11.583027 C10.5113175,11.583027 10.8121459,9.71192554 10.9579679,7.66606008 C10.5398911,7.66606008 7.31730537,7.66606008 7.31730537,7.66606008 C7.31730537,7.66606008 7.31730537,5.39585214 7.31730537,4.9979312 C7.31730537,4.59914803 7.83920313,4.06273077 8.35503169,4.06273077 C8.86989347,4.06273077 9.95654938,4.06273077 10.9630166,4.06273077 C10.9630166,3.53143302 10.9630166,1.69568318 10.9630166,0.000261904762 C9.6194132,0.000261904762 8.09083337,0.000261904762 7.4170444,0.000261904762 C2.39416114,-7.54332869e-06 2.51248375,3.90612754 2.51248375,4.4892132 Z"></path>
                  </g>
                </g>
                <g class="bring-down" stroke="#FF5829" stroke-width="1px" fill="none" transform="translate(0, 5)" style="opacity: 0.5">
                  <g>
                    <path d="M2.51248375,4.4892132 C2.51248375,5.07332278 2.51248375,7.68044861 2.51248375,7.68044861 L0.182285714,7.68044861 L0.182285714,11.5827036 L2.51248375,11.5827036 L2.51248375,23.1788333 L7.29920518,23.1788333 L7.29920518,11.583027 L10.5113175,11.583027 C10.5113175,11.583027 10.8121459,9.71192554 10.9579679,7.66606008 C10.5398911,7.66606008 7.31730537,7.66606008 7.31730537,7.66606008 C7.31730537,7.66606008 7.31730537,5.39585214 7.31730537,4.9979312 C7.31730537,4.59914803 7.83920313,4.06273077 8.35503169,4.06273077 C8.86989347,4.06273077 9.95654938,4.06273077 10.9630166,4.06273077 C10.9630166,3.53143302 10.9630166,1.69568318 10.9630166,0.000261904762 C9.6194132,0.000261904762 8.09083337,0.000261904762 7.4170444,0.000261904762 C2.39416114,-7.54332869e-06 2.51248375,3.90612754 2.51248375,4.4892132 Z"></path>
                  </g>
                </g>
                <g stroke="#FF5829" stroke-width="1px" fill="none" transform="translate(0, 10)" style="opacity: 0.25">
                  <g>
                    <path d="M2.51248375,4.4892132 C2.51248375,5.07332278 2.51248375,7.68044861 2.51248375,7.68044861 L0.182285714,7.68044861 L0.182285714,11.5827036 L2.51248375,11.5827036 L2.51248375,23.1788333 L7.29920518,23.1788333 L7.29920518,11.583027 L10.5113175,11.583027 C10.5113175,11.583027 10.8121459,9.71192554 10.9579679,7.66606008 C10.5398911,7.66606008 7.31730537,7.66606008 7.31730537,7.66606008 C7.31730537,7.66606008 7.31730537,5.39585214 7.31730537,4.9979312 C7.31730537,4.59914803 7.83920313,4.06273077 8.35503169,4.06273077 C8.86989347,4.06273077 9.95654938,4.06273077 10.9630166,4.06273077 C10.9630166,3.53143302 10.9630166,1.69568318 10.9630166,0.000261904762 C9.6194132,0.000261904762 8.09083337,0.000261904762 7.4170444,0.000261904762 C2.39416114,-7.54332869e-06 2.51248375,3.90612754 2.51248375,4.4892132 Z"></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </a>
        <a target="_blank" :href="this.getShareUrl('twitter')">
          <div class="share share--twitter">
            <svg viewBox="0 0 26 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g>
                <g class="bring-down" fill="#FF5829">
                  <g>
                    <path d="M23.4,5.6 C23.2,14.8 17.4,21.2 8.6,21.6 C5,21.8 2.4,20.6 0,19.2 C2.6,19.6000784 6,18.6000784 7.8,17 C5.2,16.8 3.6,15.4 2.8,13.2 C3.6,13.4 4.4,13.2 5,13.2 C2.6,12.4 1,11 0.8,7.8 C1.4,8.2 2.2,8.4 3,8.4 C1.2,7.4 0,3.6 1.4,1.2 C4,4 7.2,6.4 12.4,6.8 C11,1.2 18.6000784,-1.8 21.6000784,2 C23.0000784,1.8 24.0000784,1.2 25.0000784,0.8 C24.6000784,2.2 23.8000784,3 22.8000784,3.8 C23.8000784,3.6 24.8000784,3.4 25.6000784,3 C25.4,4 24.4,4.8 23.4,5.6 Z"></path>
                  </g>
                </g>
                <g class="bring-down" stroke-width="1px" stroke="#FF5829" fill="none" transform="translate(0, 5)" style="opacity: 0.5">
                  <g>
                    <path d="M23.4,5.6 C23.2,14.8 17.4,21.2 8.6,21.6 C5,21.8 2.4,20.6 0,19.2 C2.6,19.6000784 6,18.6000784 7.8,17 C5.2,16.8 3.6,15.4 2.8,13.2 C3.6,13.4 4.4,13.2 5,13.2 C2.6,12.4 1,11 0.8,7.8 C1.4,8.2 2.2,8.4 3,8.4 C1.2,7.4 0,3.6 1.4,1.2 C4,4 7.2,6.4 12.4,6.8 C11,1.2 18.6000784,-1.8 21.6000784,2 C23.0000784,1.8 24.0000784,1.2 25.0000784,0.8 C24.6000784,2.2 23.8000784,3 22.8000784,3.8 C23.8000784,3.6 24.8000784,3.4 25.6000784,3 C25.4,4 24.4,4.8 23.4,5.6 Z"></path>
                  </g>
                </g>
                <g stroke-width="1px" stroke="#FF5829" fill="none" transform="translate(0, 10)" style="opacity: 0.25">
                  <g>
                    <path d="M23.4,5.6 C23.2,14.8 17.4,21.2 8.6,21.6 C5,21.8 2.4,20.6 0,19.2 C2.6,19.6000784 6,18.6000784 7.8,17 C5.2,16.8 3.6,15.4 2.8,13.2 C3.6,13.4 4.4,13.2 5,13.2 C2.6,12.4 1,11 0.8,7.8 C1.4,8.2 2.2,8.4 3,8.4 C1.2,7.4 0,3.6 1.4,1.2 C4,4 7.2,6.4 12.4,6.8 C11,1.2 18.6000784,-1.8 21.6000784,2 C23.0000784,1.8 24.0000784,1.2 25.0000784,0.8 C24.6000784,2.2 23.8000784,3 22.8000784,3.8 C23.8000784,3.6 24.8000784,3.4 25.6000784,3 C25.4,4 24.4,4.8 23.4,5.6 Z"></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </a>
      </div>
    </section>

    <ScoreObject
      :model="$route.params.obj"
      class="score__obj"
    />
  </main>
</template>

<script>
import socket from '@/scripts/socket';
import animations from '@/scripts/animations';
import { qs, isMobileDevice } from '@/scripts/utils';

import Button from '@/components/utils/Button.vue';
import ScoreObject from '@/components/ScoreObject.vue';

import scoreMap from '@/scripts/score/scoreMap';

export default {
  name: 'Score',

  components: {
    Button,
    ScoreObject,
  },

  data() {
    return {
      isMobileDevice,
      score: [
        {
          text: '<bdi>P</bdi><bdi>o</bdi><bdi>p</bdi><bdi>s</bdi><br><bdi>i</bdi><bdi>c</bdi><bdi>l</bdi><bdi>e</bdi><br><bdi class="fill">s</bdi><bdi class="fill">u</bdi><bdi class="fill">c</bdi><bdi class="fill">k</bdi><br><bdi class="fill">e</bdi><bdi class="fill">r</bdi>',
        }, {
          text: '<bdi>D</bdi><bdi>o</bdi><bdi>-</bdi><bdi>n</bdi><bdi>o</bdi><bdi>t</bdi><br><bdi class="fill">s</bdi><bdi class="fill">t</bdi><bdi class="fill">o</bdi><bdi class="fill">p</bdi>',
        }, {
          text: '<bdi>T</bdi><bdi>h</bdi><bdi>e</bdi><bdi> </bdi><bdi>n</bdi><bdi>e</bdi><bdi>w</bdi><br><bdi class="fill">r</bdi><bdi class="fill">u</bdi><br><bdi class="fill">l</bdi><bdi class="fill">e</bdi><bdi class="fill">r</bdi>',
        }, {
          text: '<bdi>D</bdi><bdi>a</bdi><bdi>n</bdi><br><bdi>d</bdi><bdi>y</bdi><br><bdi class="fill">d</bdi><bdi class="fill">u</bdi><bdi class="fill">n</bdi><br><bdi class="fill">d</bdi><bdi class="fill">e</bdi><bdi class="fill">e</bdi>',
        }, {
          text: '<bdi>S</bdi><bdi>U</bdi>M<br><bdi>M</bdi><bdi>E</bdi><bdi>R</bdi><br><bdi class="fill">K</bdi><bdi class="fill">I</bdi><bdi class="fill">N</bdi><bdi class="fill">G</bdi>',
        },
      ],
      btn: {
        type: 'link',
        link: {
          url: this.$store.state.gameplay.sync.roomCode === null ? 'game' : '/',
        },
        content: 'RESTART',
      },
    };
  },

  created() {
    if (this.$route.params.score === undefined) {
      this.$store.commit('SET_MODE', null);
      this.$router.push('/');
    }
  },

  mounted() {
    this.animation = animations.get('score')(this.$el, this.$route.params.score);
    this.sound = this.$store.state.fx.get(this.$route.params.sound);

    if (this.$route.params.score !== undefined) {
      this.$store.commit('SET_PAGE', 'score');
      this.$store.commit('TOGGLE_LOADER');
      this.$store.commit('TOGGLE_PAUSE');

      qs('.score__text', this.$el).style.opacity = 0;
      qs('.score__result', this.$el).style.opacity = 0;
      qs('.score__btn', this.$el).style.opacity = 0;

      this.animation.play();
      this.sound.play();
    }

    if (this.$store.state.gameplay.sync.roomCode !== null && !isMobileDevice()) {
      window.addEventListener('quitgame', this.restartGame);
    }
  },

  methods: {
    getShareUrl(platform) {
      const score = this.$route.params.score; // eslint-disable-line
      const url = scoreMap[`share/${score}`];
      let text = ''; // eslint-disable-line
      if (score > 80 && score <= 100) {
        text = 'Looks like you can call me the Summer King! I just had a blast with Adoratorio Summer Club. Wanna try to dethrone me? ';
      }
      if (score > 60 && score <= 80) {
        text = 'Call that a score? This is a score. Adoratorio Summer Club just appointed me as the Dandy Dundee itself. Can you do better? ';
      }
      if (score > 40 && score <= 60) {
        text = 'The New Ruler. That’s how far I’ve went in Adoratorio Summer Club, Banana for scale. Can you do better? ';
      }
      if (score > 20 && score <= 40) {
        text = 'I’ll be the best at Adoratorio Summer Club, as long as I do-not stop. Can you do better? ';
      }
      if (score >= 0 && score <= 20) {
        text = 'That’s an embarassingly low score, the heat probably got me. Is there a popsicle around? Join the fun at Adoratorio Summer Club. ';
      }
      const facebookURL = `https://facebook.com/sharer/sharer.php?u=${url}`;
      const tweetterURL = `https://twitter.com/intent/tweet?text=${encodeURI(text)}&url=${url}&hashtags=atsc,adoratoriowow,googleexperiment,GameDev,WebExperiment`;
      return platform === 'twitter' ? tweetterURL : facebookURL;
    },

    restartGame() {
      this.$store.commit('SET_DESKTOP_STATE', false);
      this.$store.commit('SET_CONTROLLER_STATE', false);
      this.$store.commit('SET_DEVICE_ROLE', null);

      this.$store.commit('SET_PLAY_HOME_ANIMATION', false);
      this.$store.commit('SET_MODE', null);

      this.$router.push('/');
    },

    redirectHome() {
      this.$store.commit('SET_DESKTOP_STATE', false);
      this.$store.commit('SET_CONTROLLER_STATE', false);
      this.$store.commit('SET_DEVICE_ROLE', null);

      this.$store.commit('SET_PLAY_HOME_ANIMATION', false);
      this.$store.commit('SET_MODE', null);
    },
  },

  beforeDestroy() {
    this.animation.kill();
    this.animation = null;

    this.sound.stop();

    if (this.$store.state.gameplay.sync.roomCode !== null) {
      socket.quitGame();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

.score {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  background: $color-dark;

  padding: 0 20px;

  @include mq(sm) {
    padding: 0 40px;
  }

  &__placeholder {
    flex: 0 0 100%;
  }

  &__text {
    font-size: font-size(xm);
    font-weight: 900;
    text-transform: uppercase;
    line-height: 0.9em;

    color: transparent;
    -webkit-text-stroke: 1px $color-text;

    @include mq(sm) {
      -webkit-text-stroke-width: 2px;
    }

    @include mq(sm) {
      font-size: font-size(xm);
      margin: 0 0 45px;
    }

    @include mq(sm) {
      font-size: font-size(l);
    }

    @include mq(lg) {
      font-size: font-size(xl);
    }

    flex: 0 0 50%;
    max-width: 50%;
  }

  &__result {
    font-size: font-size(xm);
    font-weight: 500;
    text-transform: uppercase;
    line-height: 0.9em;
    text-align: right;
    color: transparent;
    -webkit-text-stroke: 1px $color-primary;

    @include mq(sm) {
      -webkit-text-stroke-width: 2px;
    }

    flex: 0 0 50%;
    max-width: 50%;

    @include mq(sm) {
      font-size: font-size(l);
      margin: 0 0 45px;
    }

    @include mq(sm) {
      font-size: font-size(xxl);
      margin: 0 0 45px;
    }

    @include mq(lg) {
      font-size: font-size(xxxl);
    }

    .result {
      color: $color-text;
      -webkit-text-stroke: 0px;
    }
  }

  &__obj {
    background: transparent;
    z-index: -1;

    left: 55%;
    transform: translate3d(-50%, 0, 0);
  }

  &__btn {
    cursor: pointer;
    pointer-events: auto;

    color: $color-primary;
  }

  section {
    position: relative;
    height: 100vh;

    pointer-events: none;

    @extend %flex;
    align-items: center;

    z-index: 3;
  }

  .share-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: auto;
    pointer-events: auto;

    .share {
      width: 30px;
      height: 30px;
      margin-left: 20px;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      @include mq(md) {
        width: 40px;
        height: 40px;
      }

      svg {
        height: 100%;

        .bring-down {
          transition: transform .3s ease;
        }

        &:hover {
          .bring-down {
            transform: translateY(10px);
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '../style';

.score__text {
  .fill {
    color: $color-primary;
    -webkit-text-stroke: 0px;
  }
}

.score__btn a {
  font-size: 1.4rem !important;

  @include mq(sm) {
    font-size: 2rem !important;
  }
}
</style>
