import { TimelineMax, Power4 } from 'gsap/TweenMax';

const intro = (stripesCont, stripes, mode) => {
  const leftStripes0 = stripes.slice(0, 2);
  const leftStripes1 = stripes.slice(2, 4);
  const leftStripes2 = stripes.slice(4, 6);
  const rightStripes0 = stripes.slice(6, 8).reverse();
  const rightStripes1 = stripes.slice(8, 10).reverse();
  const rightStripes2 = stripes.slice(10, 12).reverse();

  const tl = new TimelineMax({ delay: 0.2, paused: true });
  tl.add('start')
    .to(leftStripes0, 0.35, {
      scaleY: 1,
      ease: Power4.easeOut,
    }, 'start')
    .to(rightStripes2, 0.35, {
      scaleY: 1,
      ease: Power4.easeOut,
    }, 'start')
    .to(leftStripes1, 0.35, {
      scaleY: 1,
      ease: Power4.easeOut,
    }, 'start+=1.4')
    .to(rightStripes1, 0.35, {
      scaleY: 1.2,
      ease: Power4.easeOut,
    }, 'start+=1.4')
    .to(leftStripes2, 0.35, {
      scaleY: 1,
      ease: Power4.easeOut,
    }, 'start+=2.7')
    .to(rightStripes0, 0.35, {
      scaleY: 1,
      ease: Power4.easeOut,
    }, 'start+=2.7')
    .to(stripesCont, 2, {
      ease: Power4.easeOut,
      scaleX: 1.8,
    }, 'start+=4')
    .to(stripes, 1.8, {
      ease: Power4.easeOut,
      backgroundColor: '#0b0b0b',
    }, 'start+=4.4');

  // if (mode === 'desktop') {
  //   tl.play();
  // } else {
  //   tl.reverse(0);
  // }
  tl.play();

  return tl;
};

export default intro;
