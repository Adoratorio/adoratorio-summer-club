<template>
  <button
    class="button"
    :data-hover="data.hover !== undefined ? true : false"
  >
    <template v-if="data.type === 'link'">
      <router-link :to="data.link.url" :data-content="data.content">
        <span>
          {{ data.content }}
        </span>
      </router-link>
    </template>
    <template v-if="data.type === 'hold'">
      <p
        class="button__hold"
        :data-content="data.content"
      >
        <span>
          {{ data.content }}
        </span>
        <span class="holdon">
          {{ data.content }}
        </span>
      </p>
    </template>
    <template v-if="data.type !== 'link' && data.type !== 'hold'">
      <p :data-content="data.content">
        <span>
          {{ data.content }}
        </span>
      </p>
    </template>
  </button>
</template>

<script>
export default {
  name: 'Button',

  props: ['data', 'changeState'],

  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style';

.button {
  background-color: transparent;
  border: 0;
  padding: 0;
  appearance: none;

  cursor: pointer;

  &:focus {
    outline: transparent;
  }

  a,
  p {
    display: inline-block;
    position: relative;

    font-family: $font-family-h;
    font-size: font-size(xm);
    font-weight: 900;
    color: $color-primary;

    span {
      display: inline-block;
      transform: translateY(-10px);
      transition: all 0.2s ease-out;
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
      -webkit-text-stroke: 1px $color-primary;

      transition: all 0.2s ease-out;

      @include mq(sm) {
        -webkit-text-stroke-width: 2px;
      }
    }

    &::after {
      transform: translateY(-5px);
      opacity: 0.5;
      z-index: -1;
    }

    &::before {
      opacity: 0.25;
      z-index: -2;
    }

    @at-root .pointerevents:not(.touchevents) &:hover span,
    .no-pointerevents.no-touchevents &:hover span {
      transform: translateY(0);
    }

    @at-root .pointerevents:not(.touchevents) &:hover::after,
    .no-pointerevents.no-touchevents &:hover::after {
      transform: translateY(0);
      opacity: 0;
    }

    @at-root .pointerevents:not(.touchevents) &:hover::before,
    .no-pointerevents.no-touchevents &:hover::before {
      transform: translateY(0);
      opacity: 0;
    }
  }

  &[data-hover] {
    a, p {
      color: transparent;
      -webkit-text-stroke: 1px rgba($color-text, 0.2);

      @include mq(sm) {
        -webkit-text-stroke-width: 2px;
      }

      &::after,
      &::before {
        -webkit-text-stroke-color: rgba($color-text, 0.2);
      }
    }
  }

  p.button__hold {
    font-size: font-size(m);
    color: transparent;
    -webkit-text-stroke: 1px $color-primary;

    @include mq(sm) {
      -webkit-text-stroke-width: 2px;
    }

    .holdon {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;

      z-index: 2;

      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
