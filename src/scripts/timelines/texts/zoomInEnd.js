import { TimelineMax } from 'gsap/TweenMax';
import { CustomEase } from '@/assets/lib/gsap-bonus/CustomEase';

const zoomInEnd = (el, anim) => {
  const tl = new TimelineMax();

  CustomEase.create('custom', 'M0,0,C0.11,0.494,0.017,0.8,0.142,0.928,0.222,1.01,0.504,1,1,1');

  tl
    .add('start')
    .to(el, 0.2, {
      backgroundColor: anim.bgColor,
      color: anim.color,
      autoAlpha: 1,
    }, 'start')
    .to(el, 1.75, {
      scale: anim.scale,
      ease: 'custom',
    }, 'start');

  return tl;
};

export default zoomInEnd;
