<template>
  <section class="enlarge-me">
    <h1>ENLARGE ME</h1>
    <p>or play on your phone</p>
  </section>
</template>

<script>
export default {
  name: 'enlarge',
};
</script>

<style lang="scss" scoped>
@import '/../style';

@keyframes zoom {
  0% {
    transform: scale3d(1, 1, 1);
  }

  100% {
    transform: scale3d(1.9, 1.3, 1);
  }
}

.enlarge-me {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background: $color-bg;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;

  z-index: 100;

  h1 {
    color: $color-primary;
    animation: zoom 1s 0s infinite alternate backwards;
    backface-visibility: hidden;
  }
}
</style>
