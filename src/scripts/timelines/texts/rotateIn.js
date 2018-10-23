import { TimelineMax } from 'gsap/TweenMax';

const rotateIn = (el, anim) => {
  const index = el.getAttribute('js-indexgroup');
  const els = Array.from(document.querySelectorAll(`.text--column-rotation[js-indexgroup="${index}"]`));
  const elsReorder = els.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);
  const width = elsReorder[0].getBoundingClientRect().width + 10;

  const tl = new TimelineMax();

  tl.set(el, { width, textAlign: 'center' })
    .set(Array.from(el.querySelectorAll('span')), {
      autoAlpha: 0,
    })
    .addLabel('start')
    .to(el, 0.2, {
      backgroundColor: anim.bgColor,
      color: anim.color,
      webkitClipPath: 'inset(0% 0.001% 0.002% 0.003%)',
      clipPath: 'inset(0% 0.001% 0.002% 0.003%)',
    }, 'start')
    .staggerTo(Array.from(el.querySelectorAll('span')), 0.05, {
      autoAlpha: 1,
      color: anim.color,
    }, 0.02, 'start+=0.05');

  return tl;
};

export default rotateIn;
