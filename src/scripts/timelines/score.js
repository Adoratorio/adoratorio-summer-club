import { TimelineLite, Elastic, Power2 } from 'gsap/TweenMax';
import { qs, qsa } from '@/scripts/utils';

const score = (el, number) => {
  const tl = new TimelineLite({ delay: 1, paused: true });

  const percentage = { score: 0 };

  const text = qs('.score__text', el);
  const result = qs('.score__result', el);
  const btn = qs('.score__btn', el);

  const updateHandler = () => {
    qs('.result', result).innerHTML = percentage.score;
  };

  tl
    .add('start')
    .fromTo(text, 1.3, {
      transformOrigin: '0% 100%',
      skewY: 40,
      skewX: 40,
      rotationX: 90,
    }, {
      skewY: 0,
      skewX: 0,
      rotationX: 0,
      autoAlpha: 1,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }, 'start')
    .fromTo(qsa('bdi', text), 1.3, {
      scale: 0.2,
    }, {
      scale: 1,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }, 'start')
    .fromTo(result, 1.3, {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      ease: Power2.easeOut,
      clearProps: 'all',
    }, 'start+=0.4')
    .to(percentage, 1.3, {
      score: number,
      roundProps: 'score',
      onUpdate: updateHandler,
      ease: Power2.easeNone,
    }, 'start+=0.4')
    .fromTo(btn, 0.5, {
      autoAlpha: 0,
      y: 20,
    }, {
      autoAlpha: 1,
      y: 0,
      ease: Power2.easeOut,
      clearProps: 'all',
    }, 'start+=1.2');

  return tl;
};

export default score;

