import { TweenMax, Power1 } from 'gsap/TweenMax';

const zoomIn = (objCtx, anim) => {
  const tween = TweenMax.to(objCtx.container, anim.duration, {
    ease: Power1.easeOut,
    scaleX: 1,
  });

  return tween;
};

export default zoomIn;
