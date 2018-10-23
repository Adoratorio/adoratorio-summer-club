import { TweenMax, Power4 } from 'gsap/TweenMax';

const zoomOut = (objCtx, anim) => {
  const tween = TweenMax.to(objCtx.container, anim.duration, {
    ease: Power4.easeOut,
    scaleX: 1.8,
  });

  return tween;
};

export default zoomOut;
