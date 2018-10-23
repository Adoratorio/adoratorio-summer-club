import { TimelineMax } from 'gsap/TweenMax';

const staggerInGroup = (el, anim) => {
  const group = Array.from(el.querySelectorAll('div'));
  const text = Array.from(el.querySelectorAll('span'));
  const tl = new TimelineMax();

  tl
    .set(group, {
      webkitClipPath: 'inset(0% 100% 0.02% 0.03%)',
      clipPath: 'inset(0% 100% 0.02% 0.03%)',
    })
    .set(el, {
      color: anim.color,
      autoAlpha: 1,
    })
    .addLabel('start')
    .staggerFromTo(group, 0.025, {
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
    }, 0.2, 'start')
    .staggerFromTo(text, 0.05, {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
    }, 0.015, 'start+=0.1');

  return tl;
};

export default staggerInGroup;
