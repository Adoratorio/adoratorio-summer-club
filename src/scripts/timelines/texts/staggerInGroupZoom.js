import { TimelineMax } from 'gsap/TweenMax';

const staggerInGroupZoom = (el, anim) => {
  const group = Array.from(el.querySelectorAll('div'));
  const text = Array.from(el.querySelectorAll('span'));
  const tl = new TimelineMax();

  tl.set(el, {
      transformOrigin: '50% 50%',
      color: anim.color,
      autoAlpha: 1,
      scale: 1,
    })
    .addLabel('start')
    .staggerFromTo(group, 0.15, {
      webkitClipPath: 'inset(0% 100% 0.02% 0.03%)',
      clipPath: 'inset(0% 100% 0.02% 0.03%)',
      cycle: {
        backgroundColor: (index) => anim.bgColor.length === 1 ? anim.bgColor[0] : anim.bgColor[index],
      },
    }, {
      webkitClipPath: 'inset(0% 0.01% 0.02% 0.03%)',
      clipPath: 'inset(0% 0.01% 0.02% 0.03%)',
      color: anim.color,
      cycle: {
        backgroundColor: (index) => anim.bgColor.length === 1 ? anim.bgColor[0] : anim.bgColor[index],
      },
    }, 0.1, 'start')
    .to(el, 0.8, {
      scale: anim.scale,
    }, 'start')
    .staggerFromTo(text, 0.1, {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
    }, 0.02, 'start+=0.15');

  return tl;
};

export default staggerInGroupZoom;
