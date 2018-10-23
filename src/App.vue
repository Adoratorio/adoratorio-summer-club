<template>
  <div id="app">
    <HeaderComp v-if="$store.state.page !== 'loader'" />

    <transition @enter="enter" @leave="leave" mode="out-in">
      <router-view :key="$route.fullPath" v-if="!isPortrait"/>
    </transition>

    <transition>
      <Modal v-if="$store.state.modal.status" v-show="!isPortrait" />
    </transition>

    <Rotate v-if="isPortrait"/>

    <Enlarge v-if="isTooSmall"/>

    <GameTrack />
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { TimelineLite, Power2 } from 'gsap/TweenMax';

import { isMobile, isPortrait, isMobileDevice } from '@/scripts/utils';

import HeaderComp from '@/components/layout/Header.vue';
import Rotate from '@/components/Rotate.vue';
import Enlarge from '@/components/Enlarge.vue';
import Modal from '@/components/utils/Modal.vue';
import GameTrack from '@/components/GameTrack.vue';

export default {
  name: 'App',

  components: {
    HeaderComp,
    Rotate,
    Enlarge,
    Modal,
    GameTrack,
  },

  data() {
    return {
      isPortrait: isPortrait(),

      isTooSmall: false,
    };
  },

  created() {
    this.$store.commit('IS_MOBILE', isMobile());
    this.$store.commit('IS_MOBILE_DEVICE', isMobileDevice());

    this.checkIsTooSmall();

    window.addEventListener('resize', debounce(() => {
      this.isPortrait = isPortrait();
      this.$store.commit('IS_MOBILE', isMobile());
      this.$store.commit('IS_MOBILE_DEVICE', isMobileDevice());
      this.checkIsTooSmall();
    }));
  },

  methods: {
    enter(el, done) {
      const tl = new TimelineLite({
        onComplete: done,
      });

      tl
        .add('start')
        .from(el, 0.7, {
          autoAlpha: 0,
          ease: Power2.easeInOut,
          clearProps: 'autoAlpha',
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
          clearProps: 'autoAlpha',
        }, 'start');
    },

    checkIsTooSmall() {
      this.isTooSmall = (window.innerWidth < 1024 || window.innerHeight < 600) && !isMobileDevice();
    },
  },
};
</script>

<style lang="scss">
@import '/style';

body {
  background: $color-bg;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
   -khtml-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.ui-container {
  position: relative;
  width: 100%;
  max-width: $container-width;
  margin: 0 auto;

  &--small {
    max-width: 960px;
  }
}

.color--primary {
  color: $color-primary;
}
</style>
