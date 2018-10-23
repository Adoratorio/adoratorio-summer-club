import { TimelineLite, TweenMax, Elastic } from 'gsap/TweenMax';
import { qs, qsa, isMobileDevice } from '@/scripts/utils';

const step = (el) => {
  const tl = new TimelineLite();

  const title = qs('.step__title', el) || [];
  const text = qs('.step__text .step__inner p', el)  || [];
  const link = qs('.step__link', el) || qs('.step__code', el) || qs('.step__input', el) || qs('.step__btn', el) || [];

  const subtitle = qs('.step__subtitle', el);

  tl
    .add('start')
    .fromTo(text, 1.3, {
      yPercent: 100,
      autoAlpha: 1,
    }, {
      yPercent: 0,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }, 'start+=0.8')
    .fromTo(link, 1.3, {
      transformOrigin: '50% 50% 0%',
      skewY: 20,
      skewX: 20,
      rotationX: 90,
      autoAlpha: 0.2,
    }, {
      skewY: 0,
      skewX: 0,
      rotationX: 0,
      autoAlpha: 1,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }, 'start+=0.8');

  if (!isMobileDevice()) {
    tl.add(TweenMax.fromTo(title, 1.3, {
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
    }), 'start');

    tl.add(TweenMax.fromTo(subtitle, 1.3, {
      yPercent: 100,
      autoAlpha: 1,
    }, {
      yPercent: 0,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }), 'start+=0.4');

    tl.add(TweenMax.fromTo(qsa('bdi', title), 1.3, {
      scale: 0.2,
    }, {
      scale: 1,
      ease: Elastic.easeOut.config(0.5, 0.75),
      clearProps: 'all',
    }), 'start');
  }

  return tl;
};

export default step;

