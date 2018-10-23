import { TweenMax } from 'gsap/TweenMax';

const zoomIn = (el, anim) => {
  const tween = TweenMax.to(el, 0.16, {
    backgroundColor: anim.bgColor,
    color: anim.color,
    autoAlpha: 1,
    scale: anim.scale,
  });

  return tween;
};

export default zoomIn;
