import parallax from './timelines/parallax';
import home from './timelines/home';
import step from './timelines/step';
import score from './timelines/score';
import imageIn from './timelines/imageIn';
import titleIn from './timelines/titleIn';
import loader from './timelines/loader';
import intro from './timelines/intro';

const animations = new Map();

animations.set('parallax', parallax);
animations.set('home', home);
animations.set('step', step);
animations.set('score', score);
animations.set('image-in', imageIn);
animations.set('title-in', titleIn);
animations.set('loader', loader);
animations.set('intro', intro);

export default animations;
