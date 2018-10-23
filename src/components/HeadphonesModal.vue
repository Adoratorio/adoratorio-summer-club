<template>
  <div class="headphones-modal">
    <div class="headphones-modal__content">
      <img src="/static/vectors/headphones.svg" alt="Better with headphones">
      <h2>Musical experience ahead</h2>
      <div class="info">Best faced with headphones<br> and Google Chrome</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeadphonesModal',
};
</script>

<style lang="scss" scoped>
@import '../style';

.headphones-modal {
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  z-index: 4;

  @extend %flex;
  justify-content: center;
  align-items: center;

  .headphones-modal__content {
    text-transform: uppercase;
    text-align: center;

    h2 {
      color: $color-primary;
      font-size: font-size(s);
      margin-top: 40px;
      margin-bottom: 5px;
    }

    .info {
      font-size: font-size(xs);
      opacity: 0.7;
    }
  }
}
</style>
