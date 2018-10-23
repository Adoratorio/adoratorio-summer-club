<template>
  <div class="about">
    <div class="ui-container ui-container--small">
      <h2 class="title parallax">
        <div>Summer</div>
        <div>state of <span class="orange">mind</span></div>
      </h2>

      <div class="about-content">
        <div class="image-container tilted">
          <figure class="parallax">
            <img src="/static/images/img2.gif" alt="Always at work / Never at work">
            <figcaption>
              <h4 class="title">Always at work /<br/>Never at work</h4>
              <span>Adoratorio Summer Club was born from the simple willingness to create something <strong>fun </strong>and <strong>entartaining </strong>in our spare time that could give an Adoratorio’s touch to every user’s Summer, all while experimenting new technologies and facing new challenges. That’s it.</span>
            </figcaption>
          </figure>
          <h3 class="about-stripe">
            <span>THE CLUB</span>
          </h3>
        </div>

        <div class="image-container">
          <figure>
            <img src="/static/images/img1.gif" alt="Super Retro Future">
            <figcaption>
              <h4 class="image-title">Super Retro Future</h4>
              <span>We refer to this as a <strong>“Google </strong><strong>Retro-Future </strong><strong>Experiment” </strong>that finds its (conceptual) roots in Google’s 2013 Super Sync Sports, which we really enjoyed back in the days. Some <strong>Guitar </strong><strong>Hero </strong><strong>vibes </strong>couldn’t do harm either.</span>
            </figcaption>
          </figure>
        </div>

        <div class="image-container tilted-up right">
          <figure class="parallax">
            <img src="/static/images/img3.gif" alt="A joystick to rule them all">
            <figcaption>
              <h4 class="image-title">A joystick to rule them all</h4>
              <span>We are gamers. Some love Mario Kart, some Fifa, others Zelda. Tastes aside, we all share one idea: <strong>“To </strong><strong>play, </strong><strong>you </strong><strong>need </strong><strong>a </strong><strong>joystick”. </strong>Time to challenge your friends!</span>
            </figcaption>
          </figure>
          <div class="about-stripe second">
            <h3>SYYYYYNCED</h3>
          </div>
        </div>

        <div class="image-container full">
          <figure>
            <img src="/static/images/img4.gif" alt="Bruno Belissimo">
            <figcaption>
              <h4 class="image-title">Bruno Belissimo</h4>
              <span>Bruno Belissimo is a <strong>Musician, </strong><strong>Sound </strong><strong>Designer </strong>and always-welcome figure here at the studio. When setting the ground for this project, his participation was a given. Go check <strong><a href="https://open.spotify.com/artist/5LExfPIVArSHdWN83U4STI" target="_blank" rel="noopener">Bruno’s Spotify </a></strong>for more awesome music!</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div class="lets-play" @click="letsPlay">
        <Button :data="{ content: 'LET\'S PLAY' }" />
      </div>

      <ScoreObject :soft-enter="true" :delay="500" :model="'donut'" mobile-parallax="true" />
      <ScoreObject :soft-enter="true" :delay="1000" :model="'icecream'" mobile-parallax="true" />
      <ScoreObject :soft-enter="true" :delay="1500" :model="'flamingo'" mobile-parallax="true" />
      <ScoreObject :soft-enter="true" :delay="2000" :model="'crocodile'" mobile-parallax="true" />
      <ScoreObject :soft-enter="true" :delay="2500" :model="'banana'" />
    </div>
  </div>
</template>

<script>
import { TweenMax, Expo } from 'gsap';
import animations from '@/scripts/animations';
import Button from '@/components/utils/Button.vue';
import ScoreObject from '@/components/ScoreObject.vue';

export default {
  name: 'About',
  components: {
    Button,
    ScoreObject,
  },
  data() {
    return {
      parallax: [],
      mobileParallax: [],
      images: [],
      lastScroll: 0,
      lastDifference: 0,
    };
  },
  mounted() {
    this.$store.commit('SET_PAGE', 'about');
    this.parallax = Array.from(this.$el.querySelectorAll('.parallax'));
    this.mobileParallax = Array.from(this.$el.querySelectorAll('.mobile-parallax'));
    TweenMax.set(this.parallax, { yPercent: 0 });
    window.addEventListener('scroll', this.scroll, { passive: true });
    this.images = Array.from(this.$el.querySelectorAll('.image-container')).reverse();
    this.images.forEach((image) => {
      TweenMax.set(image.querySelector('img'), {
        y: 200,
        scale: 1.2,
        autoAlpha: 0,
      });
      TweenMax.set(image.querySelector('figcaption'), {
        y: 80,
        autoAlpha: 0,
      });
    });
    this.scroll();
    animations.get('title-in')(this.$el.querySelector('.title')).play();
  },
  destroy() {
    window.removeEventListener('scroll', this.scroll);
  },
  methods: {
    scroll() {
      if (window.innerWidth >= 768) {
        TweenMax.to(this.parallax, 2, {
          yPercent: ((window.scrollY * 100) / window.innerHeight) * 0.1,
          ease: Expo.easeOut,
        });
      }

      // Bounce baloons
      TweenMax.to(this.mobileParallax, 0.8, {
        yPercent: ((window.scrollY * 100) / window.innerHeight) * 0.15,
        ease: Expo.easeOut,
      });

      this.lastScroll = window.scrollY;

      // Images in
      this.images.forEach((image, index) => {
        const offset = window.innerWidth >= 768 ? 300 : 50;
        if (image.getBoundingClientRect().top < window.innerHeight - offset) {
          this.images.splice(index, 1);
          animations.get('image-in')(image).play();
        }
      });
    },
    letsPlay() {
      this.$store.commit('SET_PLAY_HOME_ANIMATION', false);
      this.$store.commit('SET_MODE', null);
      this.$router.push('/');
    },
  },
};
</script>


<style lang="scss" scoped>
@import '../style';

.about {
  position: relative;
  overflow-x: hidden;

  h2.title {
    margin-top: 100px;
    margin-bottom: 130px;
    color: transparent;
    -webkit-text-stroke: 1px $color-white;
    font-size: font-size(xm);
    text-transform: uppercase;
    font-weight: 900;
    line-height: 0.9em;
    padding: 0px 30px;

    @include mq(sm) {
      -webkit-text-stroke-width: 2px;
    }

    @include mq(md) {
      padding: 0px 40px;
      margin-top: 150px;
    }

    @include mq(lg) {
      font-size: font-size(xxm);
      margin-top: 280px;
      padding: 0px;
    }

    span.orange {
      -webkit-text-stroke-color: $color-primary;
      color: $color-primary;
    }
  }

  .about-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0px 30px;
    margin-bottom: 50px;

    @include mq(md) {
      padding: 0px 40px;
      margin-bottom: 220px;
    }

    @include mq(lg) {
      padding: 0px;
    }

    .image-container {
      position: relative;
      min-width: 48%;
      max-width: 48%;

      &.tilted {
        margin-top: 620px;
      }

      &.tilted-up {
        margin-top: -20px;
      }

      &.right {
        margin-left: auto;
        margin-top: 120px;
      }

      &.full {
        min-width: 70%;
        max-width: 70%;
        margin-top: 0px;

        @include mq(sm) {
          margin-top: 240px;
        }
      }

      figure {
        figcaption {
          width: 100%;
          margin-top: 30px;
          margin-bottom: 80px;
          line-height: 1.4em;

          @include mq(md) {
            width: 60%;
            margin-top: 50px;
            margin-bottom: 0px;
            line-height: 1.6em;
          }

          .image-title {
            font-weight: bold;
            font-size: 22px;
            margin-bottom: 10px;

            @include mq(sm) {
              margin-bottom: 20px;
            }
          }
        }

        img {
          margin: 0px;
        }
      }

      .about-stripe {
        position: absolute;
        top: 200px;
        right: -15px;
        font-size: 24px;
        color: transparent;
        -webkit-text-stroke: 1px $color-white;

        @include mq(sm) {
          -webkit-text-stroke-width: 2px;
        }

        @include mq(sm) {
          right: -100px;
          font-size: 50px;
        }

        &.second {
          left: 0px;
          top: -27px;
          -webkit-text-stroke: 0px;

          @include mq(sm) {
            top: 40px;
          }

          h3 {
            color: $color-primary;
            font-size: 24px;

            @include mq(sm) {
              font-size: 50px;
            }
          }
        }
      }
    }
  }

}
</style>

<style lang="scss">
@import '../style';

.about {
  button.button {
    width: 100%;
    margin-bottom: 50px;

    @include mq(sm) {
      margin-bottom: 220px;
    }

    p {
      font-size: font-size(xm);

      @include mq(sm) {
        font-size: font-size(l);
      }
    }
  }

  .score-object {
    width: 300px;
    height: 300px;
    -webkit-mask: linear-gradient(to top,rgba(0,0,0,.1) 0,rgba(0,0,0,1) 25px,#000 100px);

    @include mq(sm) {
      width: 300px;
      height: 530px;
    }

    &.donut {
      position: absolute;
      top: 100px;
      left: -15%;

      @include mq(sm) {
        top: 300px;
      }

      @include mq(md) {
        left: 15%;
      }
    }

    &.icecream {
      position: absolute;
      left: -35%;
      top: 45%;

      @include mq(sm) {
        left: 10%;
        top: 50%;
      }
    }

    &.flamingo {
      position: absolute;
      top: 60%;
      left: 62%;
    }

    &.crocodile {
      position: absolute;
      top: 22%;
      left: 50%;
    }

    &.banana {
      position: absolute;
      top: 78%;
      left: 50%;
      z-index: -10;
    }
  }
}
</style>
