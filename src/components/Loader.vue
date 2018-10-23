<template>
  <section class="loader">
    <div class="number number--3" data-delay="0">
      <div>3</div>
      <div>3</div>
      <div>3</div>
    </div>

    <div class="number number--2" data-delay="1.4">
      <div>2</div>
      <div>2</div>
      <div>2</div>
    </div>

    <div class="number number--1" data-delay="2.8">
      <div>1</div>
      <div>1</div>
      <div>1</div>
    </div>

    <div class="text" ref="text">
      <span>{{ text[$store.state.gameplay.mode] }}</span>
      <span class="text__motion motion1">{{ text[$store.state.gameplay.mode] }}</span>
      <span class="text__motion motion2">{{ text[$store.state.gameplay.mode] }}</span>
      <span class="text__motion motion3">{{ text[$store.state.gameplay.mode] }}</span>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { TimelineLite, TweenMax, Elastic, Power2 } from 'gsap/TweenMax';
import { qs, qsa } from '@/scripts/utils';

export default {
  name: 'Loader',

  data() {
    return {
      tl: null,
      text: {
        desktop: 'READYYYYYYYYYYYYYYYYYYYYYYY',
        synced: 'SYNNNNNNNNNNNNNNNNNCED',
      },
      delay: {
        desktop: {
          number: 0,
          text: 4.1,
        },
        synced: {
          number: 2.9,
          text: 1,
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      modalStatus: 'modalStatus',
    }),
  },

  watch: {
    modalStatus(newVal) {
      if (newVal) {
        this.tl.pause();
      } else {
        this.tl.play();
      }
    },
  },

  mounted() {
    this.tl = new TimelineLite({ paused: true });

    TweenMax.set('.number', {
      yPercent: -100,
      xPercent: -50,
    });

    TweenMax.set('.text', {
      yPercent: -50,
      xPercent: 100,
    });

    TweenMax.set('.text__motion', {
      autoAlpha: 0,
    });

    const tlNumber = new TimelineLite();
    const tlText = new TimelineLite();

    qsa('.number', this.$el).forEach((number) => {
      const tl = new TimelineLite();

      const delay = number.getAttribute('data-delay');

      tl
        .add('start')
        .to(number, 2, {
          yPercent: 0,
          y: (window.innerHeight / 2) - (number.getBoundingClientRect().height / 2),
          ease: Elastic.easeOut.config(0.5, 0.8),
        }, 'start')
        .fromTo(qs('div:nth-child(1)', number), 1, {
          y: -50,
        }, {
          y: 0,
          ease: Elastic.easeOut.config(0.5, 0.8),
        }, 'start')
        .fromTo(qs('div:nth-child(2)', number), 1, {
          y: -100,
        }, {
          y: 10,
          ease: Elastic.easeOut.config(0.5, 0.8),
        }, 'start+=0.15')
        .fromTo(qs('div:nth-child(3)', number), 1, {
          y: -150,
        }, {
          y: 20,
          ease: Elastic.easeOut.config(0.5, 0.8),
        }, 'start+=0.3')
        .staggerTo(qsa('div', number), 1.5, {
          y: -60,
          ease: Elastic.easeOut.config(0.5, 0.8),
        }, 0.05, 'start+=0.8')
        .staggerTo(qsa('div', number), 0.4, {
          autoAlpha: 0,
          ease: Power2.easeOut,
        }, -0.05, 'start+=1.2');

      tlNumber.add(tl, delay);
    });

    tlText
      .add('start')
      .to('.text', 2, {
        xPercent: 0,
        x: window.innerWidth * -1.25,
        ease: Power2.easeOut,
      }, 'start')
      .to('.text__motion.motion1', 2, {
        autoAlpha: 0.4,
        ease: Power2.easeOut,
      }, 'start')
      .to('.text__motion.motion2', 2, {
        autoAlpha: 0.25,
        ease: Power2.easeOut,
      }, 'start')
      .to('.text__motion.motion3', 2, {
        autoAlpha: 0.15,
        ease: Power2.easeOut,
      }, 'start');


    this.tl.add(tlNumber, this.delay[this.$store.state.gameplay.mode].number);
    this.tl.add(tlText, this.delay[this.$store.state.gameplay.mode].text);

    this.tl.eventCallback('onComplete', () => {
      this.$store.commit('TOGGLE_PAUSE');
      this.$store.commit('TOGGLE_LOADER');
    });

    if (!this.modalStatus) this.tl.play();
  },

  beforeDestroy() {
    this.tl.kill();
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  z-index: 3;
}

.number {
  position: absolute;
  top: 0;
  left: 50%;

  z-index: 1;

  div {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;

    font-size: 12rem;
    font-weight: 700;

    @include mq(md) {
      font-size: 18rem;
    }

    &:nth-child(1) {
      position: relative;
      color: $color-primary;
    }

    &:nth-child(2) {
      color: transparent;
      -webkit-text-stroke: 4px $color-white;

      opacity: 0.5;
      z-index: -1;
    }

    &:nth-child(3) {
      color: transparent;
      -webkit-text-stroke: 4px $color-white;

      opacity: 0.25;
      z-index: -2;
    }
  }
}

.text {
  position: absolute;
  top: 50%;
  right: 0;

  font-size: 12rem;

  @include mq(md) {
    font-size: 18rem;
  }

  font-weight: 600;
  font-family: $font-family-h;
  color: $color-primary;

  span {
    display: inline-block;
    top: 0;
    left: 0;
    position: absolute;

    &:nth-child(1) {
      position: relative;
      z-index: 2;
    }

    &:nth-child(2) {
      transform: translate3d(-50px, 0, 0) skewX(-5deg);
    }

    &:nth-child(3) {
      transform: translate3d(50px, 0, 0) skewX(-5deg);
    }

    &:nth-child(4) {
      transform: translate3d(100px, 0, 0) skewX(-5deg);
    }
  }
}
</style>
