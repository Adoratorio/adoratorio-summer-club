import { TimelineMax } from 'gsap/TweenMax';

const translateXStagger = (el, anim) => {
  const tl = new TimelineMax();
  tl
    .set(Array.from(el.querySelectorAll('span')), {
      autoAlpha: 0,
    })
    .set(el, { autoAlpha: 1, scale: anim.scaleInit })
    .addLabel('start')
    .staggerTo(Array.from(el.querySelectorAll('span')), 0.1, {
      autoAlpha: 1,
      color: anim.color,
    }, 0.02, 'start')
    .to(el, 0.15, {
      xPercent: 0,
      color: anim.color,
      scale: anim.scale,
    }, 'start');

  return tl;
};

export default translateXStagger;
