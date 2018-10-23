import { TimelineMax } from 'gsap/TimelineMax';
import { Elastic } from 'gsap/EasePack';

const titleIn = (context) => {
  const timeline = new TimelineMax({ paudes: true });
  timeline.addLabel('start')
    .fromTo(context, 0.8, {
      transformOrigin: '0% 100%',
      skewY: 40,
      skewX: 40,
      rotationX: 90,
    }, {
      skewX: 0,
      skewY: 0,
      rotationX: 0,
      autoAlpha: 1,
      ease: Elastic.easeOut.config(0.5, 0.75),
    });
  return timeline;
};

export default titleIn;
