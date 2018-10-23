import { TimelineMax } from 'gsap/TweenMax';
import { Expo } from 'gsap';

const imageIn = (context) => {
  const image = context.querySelector('img');
  const text = context.querySelector('figcaption');

  const timeline = new TimelineMax({ paused: true });
  timeline.addLabel('start')
    .to(image, 1.2, {
      y: 0,
      scale: 1,
      autoAlpha: 1,
      ease: Expo.easeOut,
    }, 'start')
    .to(text, 1.2, {
      y: 0,
      autoAlpha: 1,
      ease: Expo.easeOut,
    }, 'start+=0.2');

  return timeline;
};

export default imageIn;
