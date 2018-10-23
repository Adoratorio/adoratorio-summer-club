import { TimelineMax, TweenMax, Elastic, Power2 } from 'gsap/TweenMax';
import { qs, qsa, isMobile, isMobileDevice } from '@/scripts/utils';

const home = (el) => {
  const tl = new TimelineMax();

  const title = qs('.choice__title', el);
  const subtitle = qs('.choice__subtitle', el);
  const text = qs('.choice__text', el);
  const btn = qs('.choice__btn', el);
  const controller = qs('.choice__controller', el);

  tl
    .add('start')
    .fromTo(title, 1.3, {
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
    .fromTo(qsa('bdi', title), 1.3, {
      scale: 0.2,
    }, {
      scale: 1,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }, 'start')
    .fromTo(subtitle, 1.3, {
      yPercent: 100,
      autoAlpha: 1,
    }, {
      yPercent: 0,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }, 'start+=0.8');

  if (!isMobile()) {
    tl.add(TweenMax.fromTo(text, 1.3, {
      transformOrigin: '0% 100% 0%',
      skewX: 40,
      x: -40,
      rotationZ: 20,
      scale: 0.6,
    }, {
      rotationZ: 0,
      skewX: 0,
      x: 0,
      scale: 1,
      autoAlpha: isMobileDevice() ? 1 : 0.5,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }), 'start+=0.6');
    tl.add(TweenMax.to(btn, 0.6, {
      yPercent: 0,
      autoAlpha: 1,
      ease: Power2.easeOut,
      clearProps: 'all',
    }), 'start+=0.8');
  }

  if (!isMobileDevice()) {
    tl.add(TweenMax.to(controller, 1.3, {
      autoAlpha: 1,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }), 'start+=1');
  }

  return tl;
};

export default home;

