import { TimelineMax, Power2 } from 'gsap/TweenMax';
import { qsa } from '../../scripts/utils';

const intro = (context) => {
  const timeline = new TimelineMax({ paused: true, delay: 2.5 });
  timeline.addLabel('start')
    .to(qsa('.headphones-modal', context), 1.2, {
      autoAlpha: 0,
    })
    .to(qsa('h1 bdi', context), 0.5, {
      yPercent: 0,
      autoAlpha: 1,
      ease: Power2.easeInOut,
      clearProps: 'all',
    })
    .to(qsa('button', context), 0.5, {
      autoAlpha: 1,
      ease: Power2.easeInOut,
      clearProps: 'all',
    });
  return timeline;
};

export default intro;
