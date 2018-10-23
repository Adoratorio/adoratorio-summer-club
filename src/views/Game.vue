<template>
  <main class="game" :style="{ height: this.height }">
    <Loader v-if="$store.state.gameplay.loader && $store.state.gameplay.sync.role !== 'controller'"/>

    <GameBg
      v-if="$store.state.gameplay.sync.role !== 'controller'" :selectSound="selectSound"
    />

    <transition @enter="enter" @leave="leave" mode="out-in">
      <div
        :class="[
          'game__button-cont',
          $store.state.gameplay.sync.role === 'controller' ? 'game__button--controller' : false,
          $store.state.gameplay.pause ? 'game__button-is-paused' : false
        ]"
        v-show="(!$store.state.gameplay.loader || $store.state.gameplay.sync.role === 'controller') && buttonDisappear"
      >
        <button
          :class="[
            'game__button',
            !isMobileDevice() && ($store.state.gameplay.sync.role !== 'controller' && $store.state.gameplay.mode !== 'synced') ? 'game__button--dsk' : 'game__button--mbl',
          ]"
          js-pos="left"
          :ref="$store.state.gameplay.sync.role === 'controller' ? 'buttonLeftMobile' : 'buttonLeft'"
        >
          <span class="game__button-fill"></span>
          <span class="game__button-outline"></span>
          <p v-if="!isMobileDevice() && ($store.state.gameplay.sync.role !== 'controller' && $store.state.gameplay.mode !== 'synced')">A</p>
        </button>
        <button
          :class="[
            'game__button',
            !isMobileDevice() && ($store.state.gameplay.sync.role !== 'controller' && $store.state.gameplay.mode !== 'synced') ? 'game__button--dsk' : 'game__button--mbl',
          ]"
          js-pos="right"
          :ref="$store.state.gameplay.sync.role === 'controller' ? 'buttonRightMobile' : 'buttonRight'"
        >
          <span class="game__button-fill"></span>
          <span class="game__button-outline"></span>
          <p v-if="!isMobileDevice() && ($store.state.gameplay.sync.role !== 'controller' && $store.state.gameplay.mode !== 'synced')">D</p>
        </button>
      </div>
    </transition>

    <div
      class="pause-modal"
      v-if="$store.state.gameplay.pause && !$store.state.gameplay.loader && !this.isFailed && $store.state.gameplay.sync.role !== 'controller'"
      @click="pauseGame"
    >
      <span>PAUSED</span>
    </div>

    <transition @enter="enter" @leave="leave" mode="out-in">
      <div
        class="game__ui--desktop game__ui-cont"
        :class="isFailed ? 'game--failed__cont' : false"
        v-show="!$store.state.gameplay.loader"
        v-if="!$store.state.isMobile && $store.state.gameplay.mode !== 'synced'"
      >
        <Button
          class="game__ui__btn game__ui__btn--pause"
          :data="btn.pause"
          :class="isFailed ? 'game--failed__disabled' : false"
          @click.native="pauseGame"
        />
        <Button
          class="game__ui__btn"
          :data="btn.restart"
          :class="isFailed ? 'game--failed__active' : false"
          @click.native="restartGame"
        />
      </div>
      <div
        :class="[
          $store.state.gameplay.mode === 'synced' ? 'game__ui--mobile-controller' : false,
          isFailed ? 'game--failed__cont' : false,
          $store.state.gameplay.pause ? 'game__ui-cont-is-paused' : false
        ]"
        class="game__ui--mobile game__ui-cont"
        v-if="$store.state.isMobile"
        v-show="!$store.state.gameplay.loader"
      >
        <div
          class="game__ui__btn game__ui__btn--pause"
          @click="pauseGame"
          :class="isFailed ? 'game--failed__disabled' : false"
        >
          <img
            :src="`/static/vectors/${btn.pause.content}.svg`"
            :alt="btn.pause.content"
          >
        </div>
        <div
          class="game__ui__btn"
          :class="isFailed ? 'game--failed__active' : false"
          @click="restartGame"
        >
          <img
            :src="`/static/vectors/${btn.restart.content}.svg`"
            :alt="btn.restart.content"
            v-if="!isFailed"
          >
          <Button
          class="game__ui__btn"
          :data="btn.restart"
          v-else
        />
        </div>
      </div>
    </transition>

    <transition @enter="enter" @leave="leave" mode="out-in">
      <div
        v-show="!$store.state.gameplay.loader"
        class="ui-game-progress"
        v-if="$store.state.gameplay.sync.role !== 'controller'"
      >
        <p>{{ currentPerc }}%</p>
      </div>
    </transition>

    <Ouch />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { TweenMax, TimelineLite, Power2 } from 'gsap/TweenMax';
import debounce from 'lodash/debounce';
import Hammer from 'hammerjs';

import socket from '@/scripts/socket';

import Loader from '@/components/Loader.vue';
import GameBg from '@/components/GameBg.vue';
import Button from '@/components/utils/Button.vue';
import Ouch from '@/components/Ouch.vue';

import { qs, isMobile, isMobileDevice } from '@/scripts/utils';

import dataAnimation from '@/assets/data/texts.json';

export default {
  name: 'Game',

  data() {
    return {
      isMobile,
      isMobileDevice,
      debounce,
      dataAnimation,

      gameTl: null,
      isFailed: false,
      buttonDisappear: true,
      width: window.innerWidth,
      hammerLeft: null,
      hammerRight: null,

      binded: false,
      synced: false,
      end: false,
      restart: false,
      height: 0,

      btn: {
        pause: {
          type: 'button',
          content: 'PAUSE',
        },
        restart: {
          type: 'button',
          content: 'RESTART',
        },
      },

      sound: 'summer',
    };
  },

  components: {
    Loader,
    GameBg,
    Button,
    Ouch,
  },

  computed: {
    ...mapGetters({
      controllerConnected: 'controllerConnected',
      desktopConnected: 'desktopConnected',
      loaderStatus: 'loader',
      roleStatus: 'role',
      gameStatus: 'pause',
      gameState: 'gameState',
      endGame: 'endGame',
      page: 'page',
    }),

    currentPerc() {
      let numTot = 0; // eslint-disable-line
      this.dataAnimation.forEach((el) => {
        if (el.animationFill !== undefined) {
          el.animationFill.forEach(() => { numTot += 1; });
        }
      });
      const mid = this.gameState.correct / numTot;
      const calc = !isNaN(mid) ? Math.floor(mid * 100) : 0;

      return calc;
    },
  },

  watch: {
    roleStatus(newVal) { // eslint-disable-line
      // if (newVal !== 'controller') {
      //   this.checkSynced(this.$store.state.gameplay.sync.isControllerConnected);
      // } else {
      //   this.checkSynced(this.$store.state.gameplay.sync.isDesktopConnected);

      //   if (this.desktopConnected) {
      //     this.$store.commit('TOGGLE_PAUSE');
      //     this.$store.commit('TOGGLE_LOADER');
      //   }
      // }
    },

    controllerConnected(newVal) {
      if (this.$route.params.room !== undefined) {
        // if (!newVal && !isMobileDevice()) {
        //   this.$store.commit('SET_DESKTOP_STATE', false);
        //   this.$store.commit('SET_CONTROLLER_STATE', false);
        //   this.$store.commit('SET_DEVICE_ROLE', null);

        //   this.$store.commit('SET_PLAY_HOME_ANIMATION', false);
        //   this.$store.commit('SET_MODE', null);
        //   this.$router.push('/');
        // }

        this.checkSynced(newVal);
        if (newVal) {
          this.resetScore();
          this.$store.commit('TOGGLE_LOADER');
          if (this.$store.state.gameplay.sync.role === 'controller') {
            if (this.$store.state.gameplay.pause) {
              this.$store.commit('TOGGLE_PAUSE');
            } else {
              this.pauseGame();
            }
          } else {
            const red = this.$el.querySelector('.ouch');
            TweenMax.set(red, { autoAlpha: 0 });
            this.isFailed = false;

            if (!this.$store.state.gameplay.pause) this.$store.commit('TOGGLE_PAUSE');
          }
        }
      }
    },

    desktopConnected(newVal) {
      if (this.$route.params.room !== undefined) {
        this.checkSynced(newVal);
        if (newVal) {
          this.pauseGame();
          if (this.$store.state.gameplay.sync.role === 'controller') {
            if (this.$store.state.gameplay.pause) this.$store.commit('TOGGLE_PAUSE');
          }
        }
      }
    },

    loaderStatus(newVal) {
      if (!newVal) {
        if (this.$store.state.gameplay.sync.role !== 'controller') {
          this.timelineButton();
          this.resetScore();
          if (this.$store.state.gameplay.mode === 'synced') {
            this.syncedButton();
          }
        }
        this.bindEvents();
      } else if (this.$store.state.gameplay.sync.role !== 'controller') {
        this.gameTl.pause(0);
      }
    },

    gameStatus(newVal) {
      if (!this.$store.state.gameplay.loader) {
        if (!newVal) {
          this.gameTl.play();
          this.btn.pause.content = 'PAUSE';
        } else {
          this.gameTl.pause();
          this.btn.pause.content = 'RESUME';
        }
      }
    },

    page(newVal, oldVal) {
      if (oldVal === 'score') {
        this.$store.commit('TOGGLE_LOADER');
        this.$store.commit('TOGGLE_PAUSE');
      }
    },
  },

  created() {
    this.$store.commit('SET_PAGE', 'game');

    if (this.$route.params.room !== undefined && this.$route.params.synced === undefined) {
      this.$store.commit('SET_MODE', 'synced');
      this.$store.commit('SET_ROOM_CODE', { code: this.$route.params.room });
      socket.room(this.$route.params.room)
        .then(() => {
          socket.connect(!this.isMobileDevice())
            .then(() => {
              console.log('Room reconnected 😎');
            })
            .catch((error) => {
              if (!this.loaderStatus) this.$store.commit('TOGGLE_PAUSE');

              this.$store.commit('SET_MODAL', {
                status: true,
                message: error.message,
              });
            });
        })
        .catch((error) => {
          if (!this.loaderStatus) this.$store.commit('TOGGLE_PAUSE');

          this.$store.commit('SET_MODAL', {
            status: true,
            message: error.message,
          });
        });
    }

    if (this.$route.params.room === undefined) {
      this.$store.commit('SET_MODE', 'desktop');
    }
  },

  mounted() {
    this.heightSection();

    TweenMax.set(this.$el.querySelector('.ouch'), { autoAlpha: 0 });
    this.handlerKey = event => this.animateClick(event);

    this.handlerPause = (event) => {
      if (event.keyCode === 32) {
        this.pauseGame();
      }
    };

    this.gameTl = new TimelineLite({ paused: true });

    this.resizeHandler = debounce(() => {
      if (window.innerWidth !== this.width) {
        this.restartGame();
        this.width = window.innerWidth;
      }
    }, 200);

    window.addEventListener('resize', this.resizeHandler);

    this.handleVisibilityChange = () => {
      if (!this.gameStatus && !this.isFailed) {
        this.pauseGame();
      }
    };

    if (this.$store.state.gameplay.sync.role === 'controller' && !this.$store.state.gameplay.sync.isServerConnected) {
      this.$store.commit('SET_DESKTOP_STATE', false);
      this.$store.commit('SET_CONTROLLER_STATE', false);
      this.$store.commit('SET_DEVICE_ROLE', null);

      this.$store.commit('SET_PLAY_HOME_ANIMATION', false);
      this.$store.commit('SET_MODE', null);
      this.$router.go('/');

      this.$store.commit('SET_MODAL', {
        status: true,
        message: 'Server disconnected, retry with a new code.',
      });
    }

    if (this.$store.state.gameplay.sync.role === 'controller') {
      this.$store.commit('TOGGLE_PAUSE');
      this.$store.commit('TOGGLE_LOADER');
    }

    if (this.$store.state.gameplay.mode === 'synced') {
      window.addEventListener('quitgame', this.socketDisconnect);
    }
  },

  methods: {
    heightSection() {
      this.height = isMobileDevice() ? navigator !== undefined && navigator.vendor === 'Apple Computer, Inc.' ? `${window.innerHeight - 40}px` : `${window.innerHeight}px` : '100vh'; // eslint-disable-line
    },

    orientationCangeHandle() {
      this.height = isMobileDevice() ? navigator.vendor === 'Apple Computer, Inc.' ? `${window.innerHeight - 40}px` : `${window.innerHeight}px` : '100vh'; // eslint-disable-line
    },

    clickButton(side) {
      if (!this.isFailed) {
        if (this.$store.state.gameplay.sync.role !== 'controller') {
          // debounce(this.setScore, 100);
          this.setScore(side);
        } else {
          socket.sendClick(side);

          this.animateClickMobile(side);
        }
      }
    },

    setEndGame(event) {
      this.end = true;
      this.$router.push({ name: 'score', params: event.detail.score });
    },

    setGameover() {
      this.isFailed = true;
      // this.$store.commit('TOGGLE_PAUSE');

      if (this.hammerLeft !== null && this.hammerRight !== null) {
        this.hammerLeft.destroy();
        this.hammerRight.destroy();
      }
    },

    bindEvents() {
      if (!this.binded) {
        this.binded = true;

        if (this.$store.state.gameplay.sync.role !== 'controller') {
          this.resetScore();
        }

        if (this.$store.state.gameplay.mode === 'synced') {
          window.addEventListener('restart', this.restartGame);

          if (this.$store.state.gameplay.sync.role !== 'controller') {
            this.resetScore();
          } else {
            window.addEventListener('endgame', this.setEndGame);
            window.addEventListener('gameover', this.setGameover);
          }
        }

        if (!this.isMobileDevice()) {
          if (this.$store.state.gameplay.mode !== 'synced') {
            document.addEventListener('keydown', this.handlerKey);
            document.addEventListener('keydown', this.handlerPause);

            this.handlerBind = (e) => {
              if (e.keyCode === 65 || e.keyCode === 68) {
                const side = e.keyCode === 65 ? 'left' : 'right';
                this.clickButton(side);
              }
            };

            document.addEventListener('keydown', this.handlerBind);
          }
        } else {
          this.hammerLeft = new Hammer(qs('[js-pos="left"]', this.$el));
          this.hammerRight = new Hammer(qs('[js-pos="right"]', this.$el));

          this.hammerLeft.on('tap', () => {
            this.clickButton('left');
            this.animateClickMobile('left');
          });
          this.hammerRight.on('tap', () => {
            this.clickButton('right');
            this.animateClickMobile('right');
          });
        }
      }

      if (this.$store.state.gameplay.sync.role !== 'controller') {
        window.addEventListener('blur', this.handleVisibilityChange);
      }
    },

    syncedButton() {
      if (!this.synced) {
        this.synced = true;
        if (this.$store.state.gameplay.sync.role !== 'controller') {
          window.addEventListener('rightclick', () => {
            this.clickButton('right');
          });
          window.addEventListener('leftclick', () => {
            this.clickButton('left');
          });
        }
      }
    },

    setScore(side) {
      if (this.gameState.isValid[side] === 'correct' && this.gameState.counter <= (this.gameState.correct + this.gameState.fold + this.gameState.error)) {
        this.gameState.correct += 1;
        this.gameState.combo += 1;
        this.gameState.uncorrectCombo = 0;
        this.gameState.level = Math.floor(this.gameState.combo / 5);

        this.$store.state.fx.get(this.sound).play();
      } else if (this.gameState.isValid[side] === 'error' && this.gameState.counter <= (this.gameState.correct + this.gameState.fold + this.gameState.error)) {
        this.gameState.error += 1;
        this.gameState.combo = 0;
        this.gameState.level = 0;

        this.$store.state.fx.get('error').volume(0.3).play();
        this.redFlash();
      } else if (this.gameState.isValid[side] === 'uncorrect') {
        this.gameState.uncorrect += 1;
        this.gameState.combo = 0;
        this.gameState.level = 0;
        this.gameState.uncorrectCombo += 1;

        this.$store.state.fx.get('error').volume(0.3).play();
        this.redFlash();
      }
      // Send the score to the server
      if (this.$store.state.gameplay.mode === 'synced') {
        socket.sendScore();
      }
    },

    selectSound(val) {
      this.sound = val;
    },

    timelineButton() {
      this.animateButton('Left', 4.45);
      this.animateButton('Right', 6.45);
      this.animateButton('Left', 7.9);
      this.animateButton('Right', 8.35);

      if (!this.isMobileDevice()) {
        setTimeout(() => {
          this.buttonDisappear = false;
        }, 9000);
      }
    },

    animateButton(side, time) {
      const switchButton = side;
      const button = this.$refs[`button${switchButton}`];
      const fill = button.querySelector('.game__button-fill');

      const tl = new TimelineLite();

      tl.add('start')
        .fromTo(button, 0.4, {
          autoAlpha: 0.25,
        }, {
          autoAlpha: 1,
        }, 'start')
        .fromTo(fill, 0.4, {
          scale: 0,
        }, {
          scale: 1,
          autoAlpha: 1,
        }, 'start')
        .add('reset')
        .set(button, {
          clearProps: 'all',
          delay: 0.5,
        }, 'reset')
        .set(fill, {
          clearProps: 'all',
          delay: 0.5,
        }, 'reset');

      const delay = time;

      this.gameTl.add(tl, delay);
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
      const tl = new TimelineLite();

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

    animateClickMobile(side) {
      let el = null;

      if (side === 'left') {
        if (this.$store.state.gameplay.sync.role !== 'controller') {
          el = this.$refs.buttonLeft;
        } else {
          el = this.$refs.buttonLeftMobile;
        }
      } else if (side === 'right') {
        if (this.$store.state.gameplay.sync.role !== 'controller') {
          el = this.$refs.buttonRight;
        } else {
          el = this.$refs.buttonRightMobile;
        }
      } else {
        return;
      }

      const outline = el.querySelector('.game__button-outline');
      const fill = el.querySelector('.game__button-fill');
      const tl = new TimelineLite();

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
        }, 'start+=0.1')
        .fromTo(el, 0.1, {
          autoAlpha: 0.25,
        }, {
          autoAlpha: 1,
        }, 'start')
        .fromTo(fill, 0.1, {
          scale: 0,
        }, {
          scale: 1,
          autoAlpha: 1,
        }, 'start')
        .add('reset')
        .set(el, {
          clearProps: 'all',
          delay: 0.2,
        }, 'reset')
        .set(fill, {
          clearProps: 'all',
          delay: 0.2,
        }, 'reset');
    },

    pauseGame() {
      this.btn.pause.content = this.btn.pause.content === 'PAUSE' ? 'RESUME' : 'PAUSE';

      if (this.$store.state.gameplay.mode === 'synced') {
        socket.pauseGame();
      } else {
        if (qs('.game__ui__btn--pause', this.$el) !== null) qs('.game__ui__btn--pause', this.$el).blur();
        this.$store.commit('TOGGLE_PAUSE');
      }
    },

    restartGame() {
      this.restart = true;

      if (!this.isFailed && !this.gameStatus) {
        if (this.$store.state.gameplay.mode !== 'synced') {
          this.$store.commit('TOGGLE_PAUSE');
        } else {
          this.pauseGame();
        }
      }

      if (this.$store.state.gameplay.mode !== 'synced') {
        this.$store.commit('TOGGLE_LOADER');
      }

      if (this.isFailed) {
        TweenMax.set(this.$el.querySelector('.ouch'), { autoAlpha: 0 });

        this.gameTl.pause(0);

        this.isFailed = false;
      }

      this.gameTl.progress(0);
      this.resetScore();

      if (this.$store.state.gameplay.sync.role === 'controller') {
        socket.restartGame();
      }

      if (this.$store.state.gameplay.mode === 'synced') {
        this.resetScore();

        if (this.$store.state.gameplay.sync.role !== 'controller') {
          this.$store.commit('TOGGLE_PAUSE');
        }

        this.$router.go(this.$router.currentRoute);
      } else {
        this.resetScore();
        this.$router.replace('');
      }
    },

    resetScore() {
      this.gameState.counter = 0;
      this.gameState.correct = 0;
      this.gameState.error = 0;
      this.gameState.uncorrect = 0;
      this.gameState.level = 0;
      this.gameState.combo = 0;
      this.gameState.fold = 0;
      this.gameState.uncorrectCombo = 0;
      this.gameState.isValid.left = 'uncorrect';
      this.gameState.isValid.right = 'uncorrect';
      this.gameState.isValid.center = 'uncorrect';

      this.$store.commit('SET_GAME_STATE', this.gameState);
    },

    checkSynced(val) {
      if (!val) {
        this.$store.commit('SET_MODAL', {
          status: true,
          message: 'Controller disconnected',
        });
      } else {
        this.$store.commit('SET_MODAL', {
          status: false,
          message: '',
        });
      }
    },

    redFlash() {
      if (this.isFailed) return;
      const red = this.$el.querySelector('.ouch');
      TweenMax.set(red, { autoAlpha: 1 });
      if (this.gameState.uncorrectCombo < 5) {
        setTimeout(() => { TweenMax.set(red, { autoAlpha: 0 }); }, 200);
      } else {
        setTimeout(() => { TweenMax.set(red, { clearProps: 'all' }); }, 200);

        this.isFailed = true;
        this.$store.state.fx.get('game-over').play();

        this.pauseGame();

        if (this.$store.state.gameplay.mode === 'synced' && this.$store.state.gameplay.sync.role !== 'controller') {
          socket.gameOver();
        }

        if (this.hammerLeft !== null && this.hammerRight !== null) {
          this.hammerLeft.destroy();
          this.hammerRight.destroy();
        }

        document.removeEventListener('keydown', this.handlerBind);
        document.removeEventListener('keydown', this.handlerKey);
        document.removeEventListener('keydown', this.handlerPause);

        window.removeEventListener('gameover', this.setGameover);
      }
    },

    enter(el, done) {
      const tl = new TimelineLite({
        onComplete: done,
      });

      tl
        .add('start')
        .from(el, 0.7, {
          autoAlpha: 0,
          ease: Power2.easeInOut,
          clearProps: 'all',
        }, 'start');
    },

    leave(el, done) {
      const tl = new TimelineLite({
        onComplete: done,
      });

      tl
        .add('start')
        .to(el, 0.7, {
          autoAlpha: 0,
          ease: Power2.easeInOut,
          clearProps: 'all',
        }, 'start');
    },

    socketDisconnect() {
      this.$store.commit('SET_SERVER_STATE', false);
      this.$store.commit('SET_DESKTOP_STATE', false);
      this.$store.commit('SET_CONTROLLER_STATE', false);
      this.$store.commit('SET_DEVICE_ROLE', null);

      this.$store.commit('SET_PLAY_HOME_ANIMATION', false);
      this.$store.commit('SET_MODE', null);
      this.$router.push('/');

      socket.reference.disconnect();
    },
  },

  beforeDestroy() {
    if (this.$store.state.gameplay.sync.role !== 'controller') {
      window.removeEventListener('blur', this.handleVisibilityChange);
    }

    this.$store.commit('SET_MODE', null);
    this.$store.commit('SET_DEVICE_ROLE', null);
    if (!this.$store.state.gameplay.loader && !this.$store.state.gameplay.pause) this.$store.commit('TOGGLE_LOADER');
    if (!this.$store.state.gameplay.pause) {
      if (this.$store.state.gameplay.mode === 'synced') {
        this.$store.commit('TOGGLE_PAUSE');
      } else {
        this.pauseGame();
      }
    }

    this.gameTl.kill();
    this.gameTl = null;

    if (this.hammerLeft !== null && this.hammerRight !== null) {
      this.hammerLeft.destroy();
      this.hammerRight.destroy();
    }

    document.removeEventListener('keydown', this.handlerBind);
    document.removeEventListener('keydown', this.handlerKey);

    window.removeEventListener('resize', this.resizeHandler);

    window.removeEventListener('restart', this.restartGame);
    window.removeEventListener('endgame', this.setEndGame);
    window.removeEventListener('gameover', this.setGameover);

    window.removeEventListener('quitgame', this.socketDisconnect);
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

.game {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  &__button-cont {
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    padding: 0 75px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    mix-blend-mode: difference;
    z-index: 2;

    &.game__button--controller {
      bottom: 0;
    }

    @include mq(md) {
      position: fixed;
      bottom: 80px;
      left: 0;
      max-width: 100%;
      transform: none;
    }

    @include mq(lg) {
      left: 50%;
      transform: translateX(-50%);
      max-width: 650px;
      bottom: calc(50% - 200px);
    }

    @include mq(xxl) {
      max-width: 950px;
    }

    @media only screen
    and (min-device-width: 1024px)
    and (max-device-width: 1366px)
    and (-webkit-min-device-pixel-ratio: 1.5) {
      left: 0;
      max-width: 100%;
      transform: none;
      padding: 0 140px;
      width: 100%;
    }
  }

  @at-root .no-pointerevents.touchevents .game__button-cont {
    @include mq(sm) {
      bottom: 100px;
    }

    @include mq(md) {
      bottom: 140px;
    }
  }

  .pause-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;

    cursor: pointer;

    background-color: rgba(0, 0, 0, 0.95);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: font-size(l);
    font-family: $font-family-h;

    color: transparent;
    -webkit-text-stroke: 1px white;

    @include mq(sm) {
      font-size: font-size(xl);
      -webkit-text-stroke-width: 2px;
    }
  }

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

    touch-action: manipulation;

    &-is-paused {
      pointer-events: none;
    }

    &.game__button--dsk {
      pointer-events: none;
    }

    &.game__button--mbl {
      border-radius: 50%;
      width: 70px;
      height: 70px;

      @include mq(sm) {
        width: 100px;
        height: 100px;
      }

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

        z-index: -1;
      }
    }
  }

  &__ui {
    &-cont {
      position: absolute;
      left: 50%;
      bottom: 0;
      padding: 0 0 40px 0;

      display: flex;
      align-items: center;
      justify-content: space-between;

      transform: translate3d(-50%, 0, 0);

      z-index: 5;

      @include mq(lg) {
        width: 100%;
      }

      @media only screen
      and (min-device-width: 1024px)
      and (max-device-width: 1366px)
      and (-webkit-min-device-pixel-ratio: 1.5) {
        width: auto;
      }

      &.game__ui--mobile {
        mix-blend-mode: difference;
        opacity: 0.5;
      }
    }

    &__btn {
      margin: 0 20px;

      @include mq(md) {
        margin: 0 60px;
      }
    }

    &--desktop {
      &.game__ui-cont {
        padding: 0 0 40px 0;
      }
    }

    &--mobile {
      .game__ui__btn {
        min-height: 50px;
        min-width: 50px;
        margin: 0px 15px;
        padding: 30px 20px 0px 20px;
        cursor: pointer;
      }

      &-controller {
        &.game__ui-cont {
          padding: 0 0 20px 0;
        }
      }
    }
  }

  &--failed__disabled {
    display: none;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  &--failed__cont {
    justify-content: center;
    mix-blend-mode: unset !important;
    opacity: 1 !important;
  }

  .ui-game-progress {
    position: absolute;
    top: 25px;
    left: 50%;

    transform: translate3d(-50%, 0, 0);

    font-size: 1.4rem;
    font-family: $font-family-h;
    color: white;
    mix-blend-mode: difference;

    @include mq(md) {
      top: 35px;
      font-size: font-size(m);
    }

    opacity: 0.3;
  }
}

.game__ui-cont-is-paused {
  mix-blend-mode: unset !important;
  opacity: 1 !important;
}

</style>

<style lang="scss">
@import '../style';

.game__ui__btn p {
  font-size: 1.25rem !important;
  @include mq(md) {
    font-size: 1.43rem !important;
  }
}

.game__ui__btn.game--failed__active p {
  color: $color-text !important;
  &::before, &::after {
    -webkit-text-stroke-color: $color-text !important;
  }
}
</style>

