import staggerIn from './timelines/texts/staggerIn';
import staggerOut from './timelines/texts/staggerOut';
import staggerInGroup from './timelines/texts/staggerInGroup';
import staggerInGroupZoom from './timelines/texts/staggerInGroupZoom';
import zoomIn from './timelines/texts/zoomIn';
import zoomInEnd from './timelines/texts/zoomInEnd';
import rotateIn from './timelines/texts/rotateIn';
import rotateOut from './timelines/texts/rotateOut';
import stomp from './timelines/texts/stomp';
import translateX from './timelines/texts/translateX';
import translateXStagger from './timelines/texts/translateXStagger';
import removeNode from './timelines/texts/removeNode';

const animationsTexts = new Map();

animationsTexts.set('staggerIn', staggerIn);
animationsTexts.set('staggerOut', staggerOut);
animationsTexts.set('staggerInGroup', staggerInGroup);
animationsTexts.set('staggerInGroupZoom', staggerInGroupZoom);
animationsTexts.set('zoomIn', zoomIn);
animationsTexts.set('zoomInEnd', zoomInEnd);
animationsTexts.set('rotateIn', rotateIn);
animationsTexts.set('rotateOut', rotateOut);
animationsTexts.set('stomp', stomp);
animationsTexts.set('translateX', translateX);
animationsTexts.set('translateXStagger', translateXStagger);
animationsTexts.set('removeNode', removeNode);

export default animationsTexts;