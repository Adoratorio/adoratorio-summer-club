<template>
  <nav v-if="$store.state.page !== 'loader'">
    <transition name="fade" mode="out-in">
      <div v-if="($store.state.page !== 'game' && $store.state.page !== 'score')">
        <router-link
          to="/"
          @click.native="$store.commit('SET_PLAY_HOME_ANIMATION', false); $store.commit('SET_MODE', null)"
        >
          <bdi>P</bdi><bdi>l</bdi><bdi>a</bdi><bdi>y</bdi>
        </router-link>
        <router-link
          to="/about"
        >
          <bdi>A</bdi><bdi>b</bdi><bdi>o</bdi><bdi>u</bdi><bdi>t</bdi>
        </router-link>
      </div>
      <router-link to="/"
        v-if="(($store.state.page === 'game' && !$store.state.gameplay.loader) || ($store.state.page === 'score' && !$store.state.gameplay.loader))"
        @click.native="quitGame"
      >
        <bdi>E</bdi><bdi>x</bdi><bdi>i</bdi><bdi>t </bdi><bdi>G</bdi><bdi>a</bdi><bdi>m</bdi><bdi>e</bdi>
      </router-link>
    </transition>
  </nav>
</template>

<script>
import { TweenMax, Power2 } from 'gsap/TweenMax';

import socket from '@/scripts/socket';
import { qsa } from '@/scripts/utils';

export default {
  name: 'Navigation',

  data() {
    return {
      socket,
    };
  },

  mounted() {
    TweenMax.set(qsa('bdi', this.$el), {
      yPercent: 100,
    });

    this.animation();
  },

  methods: {
    animation() {
      TweenMax.staggerTo(qsa('bdi', this.$el), 0.5, {
        yPercent: 0,
        ease: Power2.easeOut,
        clearProps: 'all',
      }, 0.02);
    },

    quitGame() {
      if (this.$store.state.gameplay.mode === 'synced') {
        socket.quitGame();
      } else {
        if (!this.$store.state.pause) this.$store.commit('TOGGLE_PAUSE');
        if (!this.$store.state.loader) this.$store.commit('TOGGLE_LOADER');
      }

      this.$store.commit('SET_PLAY_HOME_ANIMATION', false);
      this.$store.commit('SET_MODE', null);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../style';

nav {
  position: relative;
  height: 20px;

  @extend %flex;
  align-items: baseline;
  justify-content: flex-end;

  pointer-events: all;

  a {
    display: inline-block;
    position: relative !important;
    font-weight: 500;
    text-transform: lowercase;
    line-height: 1em;

    padding: 0 0 4px 0;

    overflow: hidden;

    opacity: 0.8;
    transition: opacity 0.3s ease
      background-color 0.3s ease;

    &.router-link-exact-active {
      opacity: 1;
      color: $color-primary;
    }

    &.fade-enter-active {
      transition: opacity .5s ease-out 0.5s;
    }

    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      white-space: nowrap;
    }

    &.fade-enter-to,
    &.fade-leave {
      display: inline-block;
      position: relative;
      opacity: 0.8;
      width: 100%;
    }

    & + a {
      margin: 0 0 0 22px;
      opacity: 0.8;
    }

    bdi {
      display: inline-block;
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
        &:nth-child(6) { animation-delay: 0.10s }
        &:nth-child(7) { animation-delay: 0.12s }
        &:nth-child(8) { animation-delay: 0.14s }
        &:nth-child(9) { animation-delay: 0.16s }
        &:nth-child(10) { animation-delay: 0.18s }
      }
    }
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
