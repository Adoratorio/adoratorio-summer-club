import { TimelineMax, Power2 } from 'gsap/TweenMax';
import { qsa } from '../../scripts/utils';

const loader = (context) => {
  const timeline = new TimelineMax({ paused: true });
  timeline.addLabel('start')
    .set(qsa('h1 bdi.fill', context), {
      yPercent: 50,
      autoAlpha: 0,
    })
    .set(qsa('h1 bdi.outline', context), {
      yPercent: -50,
      autoAlpha: 0,
    })
    .set(qsa('.headphones-modal', context), {
      autoAlpha: 0,
    })
    .set('.intro__getready--get', {
      yPercent: -100,
      autoAlpha: 0,
      perspective: 400,
    })
    .set('.intro__getready--ready', {
      yPercent: 100,
      autoAlpha: 0,
      perspective: 400,
    })
    .set('.intro__getready h2', {
      skewY: 40,
      skewX: 40,
      rotationX: 90,
    })
    .set('.holdon', {
      css: {
        background: 'linear-gradient(to right, #ff5829 0%, #000000 0%)',
      },
    })
    .set('.intro__motion', {
      autoAlpha: 0,
    })
    .set(qsa('button', context), {
      autoAlpha: 0,
    })
    .to(qsa('.headphones-modal', context), 1.2, {
      autoAlpha: 1,
      ease: Power2.easeOut,
    });
  return timeline;
};

export default loader;
