<template>
  <!-- eslint-disable -->
  <router-link 
    to="/"
    @click.native="$store.commit('SET_MODE', null); $store.commit('SET_PAGE', 'loader');"
    @mouseenter.native="!isMobileDevice() ? tl.reverse() : false"
    @mouseleave.native="!isMobileDevice() ? tl.play() : false"
    class="logo logo--atsc"
    alt="Adoratorio Summer Club"
  >
    <svg viewBox="0 0 46 60" xmlns="http://www.w3.org/2000/svg">
      <g fill="#FFFFFF" fill-rule="evenodd">
        <path data-width="23" data-align="odd" class="path path--a" d="M6.417 0L0 14h7.02l.714-1.675h6.8L15.249 14H23L16.18 0H6.417zm4.68 4.31l1.664 3.875h-3.29l1.627-3.876z"/>
        <path data-width="20" data-align="even" class="path path--s" d="M34.7 29c-7.975 0-8.7-2.974-8.7-4.715v-.145h7.87c0 .58.247 1.45 2.086 1.45 1.556 0 2.016-.453 2.016-.942v-.055c0-.453-.177-.87-2.44-.96l-2.777-.092c-5.411-.199-6.543-2.158-6.543-4.28v-.163c0-2.539 1.98-4.098 8.347-4.098h2.246c7.055 0 8.7 1.922 8.7 4.244v.09h-7.71c-.053-.435-.265-1.088-2.016-1.088-1.61 0-1.91.254-1.91.707v.037c0 .49.513.761 2.546.815l2.653.073c5.128.145 6.932 1.415 6.932 4.153v.254C46 26.679 44.497 29 37.017 29H34.7z"/>
        <path data-width="22" data-align="odd" class="path path--t" d="M7.654 36.817H2V32h18v4.817h-5.654V46H7.654z"/>
        <path data-width="22" data-align="even" class="path path--c" d="M34.392 60C25.274 60 24 56.322 24 53.718v-.503C24 50.595 25.203 47 34.392 47h.628c8.85 0 9.98 3.46 9.98 5.307v.252h-6.91c-.09-.268-.377-1.578-3.482-1.578-3.052 0-3.59 1.242-3.59 2.334v.202c0 1.075.592 2.469 3.59 2.469 3.14 0 3.428-1.411 3.482-1.713H45v.436C45 56.456 43.87 60 35.02 60h-.628z"/>
      </g>
    </svg>
  </router-link>
  <!-- eslint-enable -->
</template>

<script>
import { TweenMax, TimelineLite, Power2 } from 'gsap/TweenMax';
import { qsa, isMobileDevice } from '@/scripts/utils';

export default {
  name: 'Logo',

  data() {
    return {
      isMobileDevice,
      tl: null,
      paths: null,
      first: true,
    };
  },

  mounted() {
    this.$el.classList.add('animating');
    this.paths = qsa('svg .path', this.$el);

    this.paths.forEach((path) => {
      const align = path.getAttribute('data-align') === 'odd' ? 1 : -1;
      const width = path.getAttribute('data-width');
      const x = (23 - (width / 2)) * align;

      TweenMax.set(path, {
        opacity: 0,
        x,
      });
    });

    this.animation();
  },

  methods: {
    animation() {
      this.tl = new TimelineLite({
        onComplete: () => {
          this.tl.timeScale(2);
          this.first = false;
          this.$el.classList.remove('animating');
        },
      });

      this.tl.add('start');

      if (this.first) {
        TweenMax.staggerTo(this.paths, 1, {
          opacity: 1,
          ease: Power2.easeOut,
        }, 0.1);
      }

      this.tl.to(this.paths, 0.5, {
        x: 0,
        clearProps: 'all',
        ease: Power2.easeOut,
      }, 'start+=0.7');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '/../../../style';

.logo {
  display: inline-block;

  pointer-events: all;

  svg {
    height: 40px;

    @include mq(sm) {
      height: 60px;
    }
  }
  path {
    position: relative;
  }

  &.animating {
    pointer-events: none;
  }
}
</style>
