import { TimelineMax } from 'gsap/TweenMax';

const staggerIn = (el, anim) => {
  const tl = new TimelineMax();

  tl.set(Array.from(el.querySelectorAll('span')), {
      autoAlpha: 0,
    })
    .to(el, 0.1, {
      transformOrigin: '0% 50%',
      backgroundColor: anim.bgColor,
      color: anim.color,
      webkitClipPath: 'inset(0% 0.001% 0.002% 0.003%)',
      clipPath: 'inset(0% 0.001% 0.002% 0.003%)',
    })
    .staggerTo(Array.from(el.querySelectorAll('span')), 0.1, {
      autoAlpha: 1,
      color: anim.color,
    }, 0.02);

  return tl;
};

export default staggerIn;
