import { TimelineMax } from 'gsap/TweenMax';

const setInstantColor = (objCtx, anim) => {
  const tl = new TimelineMax();

  const backgroundColor = anim.bgColor === '#ffffff' ? '#ffffff' : '#151515';

  tl.addLabel('start')
    .to(objCtx.container, 0.01, { backgroundColor }, 'start')
    .to(objCtx.stripes, 0.01, { backgroundColor: anim.bgColor }, 'start');

  return tl;
};

export default setInstantColor;
