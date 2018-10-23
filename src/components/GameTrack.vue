<template>
  <section></section>
</template>

<script>
import { mapGetters } from 'vuex';
import { Howl } from 'howler';

import sounds from '@/assets/data/fx.json';

export default {
  name: 'GameTrack',

  data() {
    return {
      sounds,
      isFirst: true,
      inBlur: null,
    };
  },

  computed: {
    ...mapGetters({
      gameStatus: 'pause',
      loaderStatus: 'loader',
      page: 'page',
    }),
  },

  watch: {
    gameStatus(newVal) {
      if (!this.$store.state.gameplay.loader && this.$store.state.gameplay.sync.role !== 'controller' && this.$store.state.page === 'game') {
        if (!newVal) {
          if (this.isFirst) {
            this.$store.state.track.seek(0).play();
            this.isFirst = false;
          } else {
            this.$store.state.track.play();
          }
        } else {
          this.$store.state.track.pause();
        }
      }
    },

    page(newVal, oldVal) {
      if (oldVal === 'game') {
        this.$store.state.track.stop();
        this.isFirst = true;

        setTimeout(() => {
          this.$store.state.loop.fade(0.0, 0.3, 3000).play();
        }, 3000);
      }
      if (newVal === 'game') {
        this.$store.state.loop.fade(0.3, 0.0, 3000);

        this.$store.state.loop.once('fade', () => {
          this.$store.state.loop.pause();
        });
      }
    },

    loaderStatus(newVal) {
      if (newVal) {
        this.$store.state.track.stop();
      }
    },
  },

  mounted() {
    this.$store.state.track = new Howl({
      src: '/static/sounds/atsc__belissimo.mp3',
      volume: 0.4,
    });

    this.$store.state.loop = new Howl({
      src: '/static/sounds/loop.mp3',
      loop: true,
      volume: 0.3,
    });

    sounds.forEach((sound) => {
      const fx = new Howl({
        src: sound.src,
        volume: 1.0,
      });

      this.$store.state.fx.set(sound.id, fx);
    });


    this.handleVisibilityChangeBlur = () => {
      if (this.$store.state.loop.playing() && this.page !== 'game') {
        this.$store.state.loop.pause();
      }
    };

    this.handleVisibilityChangeFocus = () => {
      if (!this.$store.state.loop.playing() && this.page !== 'game') {
        this.$store.state.loop.play();
      }
    };

    window.addEventListener('blur', this.handleVisibilityChangeBlur);
    window.addEventListener('focus', this.handleVisibilityChangeFocus);
  },

  beforeDestroy() {
    this.$store.state.track.unload();
    this.$store.state.track = null;

    window.removeEventListener('blur', this.handleVisibilityChangeBlur);
    window.removeEventListener('focus', this.handleVisibilityChangeFocus);
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

section {
  position: absolute;

  @include visually-hidden;
}
</style>
