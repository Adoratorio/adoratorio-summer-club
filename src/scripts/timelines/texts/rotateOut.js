import { TimelineMax } from 'gsap/TweenMax';

const rotateOut = (el) => {
  const tl = new TimelineMax({
    onComplete: () => {
      el.remove();
    },
  });

  tl.addLabel('start')
    .staggerTo(Array.from(el.querySelectorAll('span')), 0.05, {
      autoAlpha: 0,
    }, -0.02, 'start')
    .to(el, 0.15, { webkitClipPath: 'inset(0% 100% 0.002% 0.003%)', clipPath: 'inset(0% 100% 0.002% 0.003%)' }, 'start+=0.1');

  return tl;
};

export default rotateOut;
