<template>
  <header
    :class="[$store.state.page === 'game' ? 'header--in-game' : false]"
  >
    <div class="header__wrapper">
      <div class="header-container">
        <Logo class="logo" />
        <Navigation />
      </div>
    </div>
  </header>
</template>

<script>
import Logo from '@/components/layout/header/Logo.vue';
import Navigation from '@/components/layout/header/Navigation.vue';

export default {
  name: 'Header',

  components: {
    Logo,
    Navigation,
  },
};
</script>

<style lang="scss" scoped>
@import '/../../style';

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  transform: none;

  pointer-events: none;

  z-index: z-index(header);

  &.header--in-game {
    mix-blend-mode: difference;

    .logo {
      pointer-events: none;
    }
  }

  .header__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20px 30px;

    @include mq(md) {
      padding: 40px;
    }
  }

  .header-container {
    width: 100%;

    @extend %flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
