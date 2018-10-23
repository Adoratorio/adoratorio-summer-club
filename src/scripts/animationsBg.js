import intro from './timelines/bg/intro';
import recolorFromCenter from './timelines/bg/recolorFromCenter';
import recolorFromLeft from './timelines/bg/recolorFromLeft';
import recolorFromRight from './timelines/bg/recolorFromRight';
import setInstantColor from './timelines/bg/setInstantColor';
import zoomIn from './timelines/bg/zoomIn';
import zoomOut from './timelines/bg/zoomOut';

const animationsBg = new Map();

animationsBg.set('intro', intro);
animationsBg.set('recolorFromCenter', recolorFromCenter);
animationsBg.set('recolorFromLeft', recolorFromLeft);
animationsBg.set('recolorFromRight', recolorFromRight);
animationsBg.set('setInstantColor', setInstantColor);
animationsBg.set('zoomIn', zoomIn);
animationsBg.set('zoomOut', zoomOut);

export default animationsBg;
