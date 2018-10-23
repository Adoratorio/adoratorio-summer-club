import { TimelineMax } from 'gsap/TimelineMax';


const recolorFromCenter = (objCtx) => {
  const halfArray = objCtx.stripes.length / 2;
  const leftStripes = objCtx.stripes.slice(0, halfArray);
  const leftColor = objCtx.colors.slice(0, halfArray);
  const rightStripes = objCtx.stripes.slice(halfArray);
  const rightColor = objCtx.colors.slice(halfArray);

  const tl = new TimelineMax();

  tl.add('start')
    .staggerTo(leftStripes, 0.2, {
      cycle: {
        backgroundColor: index => leftColor[(leftColor.length - 1) - index],
      },
    }, -0.01, 'start')
    .staggerTo(rightStripes, 0.2, {
      cycle: {
        backgroundColor: index => rightColor[index],
      },
    }, 0.01, 'start')
    .to(objCtx.container, 0.01, { backgroundColor: '#272727' });

  return tl;
};

export default recolorFromCenter;
