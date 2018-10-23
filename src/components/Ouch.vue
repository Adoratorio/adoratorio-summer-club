<template>
   <div class="ouch">
     <div class="ouch__red-background">
        <div
          class="ouch__text"
          v-if="$store.state.gameplay.state.uncorrectCombo >= 5"
          data-content="GAME OVER!"
        >
          <span>GAME OVER!</span>
       </div>
     </div>
   </div>
</template>

<script>
export default {
  name: 'Ouch',
  data() {
    return { };
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

.ouch {
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  z-index: 4;

  &__red-background {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 88, 41, 0.75);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__text {
    position: relative;
    color: $color-black;
    font-size: 50px;
    font-weight: 400;
    font-family: $font-family-h;

    @include mq(sm) {
      font-size: 80px;
    }

    @include mq(md) {
      font-size: 120px;
    }

    span {
      display: inline-block;

      animation: spanActive 0.2s ease-out forwards 0.2s;
    }

    &::after,
    &::before {
      content: attr(data-content);

      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;

      color: transparent;
      -webkit-text-stroke: 1px $color-black;

      @include mq(sm) {
        -webkit-text-stroke-width: 2px;
      }

      transform: translateY(0);
      opacity: 0;
    }

    span {
      transform: translateY(0);
    }

    &::before {
      z-index: -1;

      animation: beforeActive 0.2s ease-out forwards 0.2s;
    }

    &::after {
      z-index: -2;

      animation: afterActive 0.2s ease-out forwards 0.2s;
    }
  }
}

@keyframes spanActive {
  100% {
    transform: translateY(-10px);
  }
}

@keyframes beforeActive {
  100% {
    opacity: 0.75;
  }
}

@keyframes afterActive {
  100% {
    transform: translateY(-5px);
    opacity: 0.95;
  }
}
</style>

