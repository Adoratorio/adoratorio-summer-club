<template>
  <section>
    <video class="turn" autoplay loop playsinline muted>
      <source src="/static/video/turn@2x.mp4" type="video/mp4">
    </video>
    <video class="head" autoplay loop playsinline muted>
      <source src="/static/video/head@2x.mp4" type="video/mp4" />
    </video>
  </section>
</template>

<script>
export default {
  name: 'Rotate',
};
</script>

<style lang="scss" scoped>
@import '/../style';

section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-bg;
  z-index: 100;

  .head {
    position: absolute;
    bottom: 50px;
  }

  video.turn {
    width: 270px;
    height: 240px;
  }

  video.head {
    width: 206px;
    height: 44px;
  }
}
</style>
