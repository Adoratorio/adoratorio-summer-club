import { TimelineMax } from 'gsap/TweenMax';


const recolorFromLeft = (objCtx) => {
  const tl = new TimelineMax();
  tl.staggerTo(objCtx.stripes, 0.2, {
    cycle: {
      backgroundColor: index => objCtx.colors[index],
    },
  }, 0.03)
  .to(objCtx.container, 0.01, { backgroundColor: '#272727' });

  return tl;
};

export default recolorFromLeft;
