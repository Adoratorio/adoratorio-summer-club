import { TimelineMax } from 'gsap/TweenMax';

const translateX = (el, anim) => {
  const tl = new TimelineMax();
  tl.to(el, 0.01, { autoAlpha: 1, scale: anim.scaleInit })
    .to(el, 0.2, {
      xPercent: 0,
      color: anim.color,
      scale: anim.scale,
    });

  return tl;
};

export default translateX;
