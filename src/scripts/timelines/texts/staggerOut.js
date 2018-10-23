import { TimelineMax } from 'gsap/TweenMax';

const staggerOut = (el, anim) => {
  const tl = new TimelineMax();

  tl.staggerTo(Array.from(el.querySelectorAll('span')), 0.05, {
      autoAlpha: 0,
      delay: 0.4,
    }, -0.01)
    .to(el, 0.15, { display: 'none' });

  return tl;
};

export default staggerOut;
