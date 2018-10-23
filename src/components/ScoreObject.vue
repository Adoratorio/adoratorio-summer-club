<template>
  <div class="component score-object mobile-parallax" :class="this.model">
    <div class="canvas-container" ref="canvasContainer"></div>
  </div>
</template>

<script>
import ScoreObjects from '@/scripts/score/ScoreObjects';

export default {
  name: 'ScoreObject',
  props: ['model', 'soft-enter', 'delay'],
  data() {
    return { };
  },
  mounted() {
    setTimeout(() => {
      const three = import('three');
      const objloader = import('three-obj-loader');
      Promise.all([three, objloader]).then((load) => {
        const THREE = load[0];
        const OBJLoader = load[1].default;
        OBJLoader(THREE);
        const container = this.$refs.canvasContainer;
        const scoreObjects = new ScoreObjects(THREE, this.model, container, this.softEnter);
        scoreObjects.init();
        this.$el.addEventListener('mousedown', scoreObjects.mouseDownHandler);
        this.$el.addEventListener('mouseup', scoreObjects.mouseUpHandler);
        this.$el.addEventListener('mousemove', scoreObjects.mouseMoveHandler);
        this.$el.addEventListener('touchmove', scoreObjects.mouseMoveHandler);
      });
    }, this.delay ? this.delay : 0);
  },
};
</script>

<style lang="scss" scoped>
@import '../style';

.score-object {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 600px;
  height: 100vh;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
