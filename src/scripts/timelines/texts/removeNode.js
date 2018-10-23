import { TweenMax } from 'gsap/TweenMax';

const removeNode = (el) => {
  const tween = TweenMax.to(el, 0.01, {
    display: 'none',
    onComplete: () => {
      el.remove();
    },
  });

  return tween;
};

export default removeNode;
