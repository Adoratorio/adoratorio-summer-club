import { TweenMax } from 'gsap/TweenMax';

const stomp = (el, anim) => {
  const tween = TweenMax.to(el, 0.01, {
      autoAlpha: 1,
      backgroundColor: anim.bgColor,
      color: anim.color,
    });

  return tween;
};

export default stomp;
