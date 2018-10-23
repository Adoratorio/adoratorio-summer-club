<template>
  <div class="modal">
    <div class="modal__bg"></div>
    <div class="modal__wrapper">
      <div class="modal__inner">
        <div class="modal__close" @click="closeModal">
          <span></span>
          <span></span>
        </div>
        <div class="modal__icon">
          <img src="/static/vectors/warning.svg" alt="Warning" />
        </div>
        <div
          class="modal__text"
          v-html="$store.state.modal.message"
        >
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '@/scripts/socket';

export default {
  name: 'Modal',

  data() {
    return {
    };
  },

  methods: {
    closeModal() {
      this.$store.commit('SET_MODAL', {
        status: false,
        message: '',
      });

      if (this.$store.state.gameplay.mode === 'synced') this.quitGame();
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

      this.$router.go('/');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../style';

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  @extend %flex;
  align-items: center;
  justify-content: center;

  z-index: 100;

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: rgba($color-text, 0.4);

    cursor: pointer;
    z-index: 1;
  }

  &__wrapper {
    animation: wrapperActive 0.3s ease-out forwards 0.3s;
    position: relative;
    width: 100%;
    max-width: 500px;
    z-index: 2;

    &::before, &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background: $color-dark;
    }

    &::before {
      animation: beforeActive 0.3s ease-out forwards 0.3s;
      opacity: 0.50;
    }

    &::after {
      animation: afterActive 0.3s ease-out forwards 0.3s;
      opacity: 0.25;
    }
  }

  &__inner {
    position: relative;
    width: 100%;
    height: 300px;
    max-height: 75vh;

    text-align: center;
    padding: 40px 20px;

    background: $color-dark;
    z-index: 2;

    @extend %flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    @include mq(md) {
      padding: 60px 40px;
    }
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 22px;
    height: 22px;
    z-index: 4;

    transition: transform 0.2s ease-out;

    cursor: pointer;

    span {
      position: absolute;
      width: 100%;
      height: 2px;

      background: $color-primary;

      top: 10px;
      left: 0;

      transition: transform 0.2s ease-out;

      &:first-child {
        transform: rotate(45deg);
      }

      &:last-child {
        transform: rotate(-45deg);
      }
    }
    @at-root .pointerevents:not(.touchevents) &:hover,
    .no-pointerevents.no-touchevents &:hover {
      span {
        &:first-child {
          transform: rotate(0deg);
        }

        &:last-child {
          transform: rotate(0deg);
        }
      }
    }
  }

  &__icon {
    margin: 0 auto;
    display: inline-block;

    img {
      width: 100%;
      max-width: 93px;
    }
  }

  &__text {
    flex: 0 0 100%;
    margin: 20px 0 0 0;
    color: $color-text;
    font-weight: 500;
    font-family: $font-family-base;
    font-size: 1.5rem;
  }
}

@keyframes wrapperActive {
  100% {
    transform: translate3d(-10px, -10px, 0);
  }
}

@keyframes beforeActive {
  100% {
    transform: translate3d(10px, 10px, 0);
  }
}

@keyframes afterActive {
  100% {
    transform: translate3d(20px, 20px, 0);
  }
}
</style>
