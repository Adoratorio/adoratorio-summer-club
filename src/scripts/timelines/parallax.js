import TweenLite from 'gsap/TweenLite';

import { lerp } from '../utils';

const offsets = [];

const parallax = (el, i) => {
  const bound = el.parentElement.getBoundingClientRect().top;
  let final = 1;

  if (!el.getAttribute('data-animated')) {
    el.setAttribute('data-animated', true);
    offsets[i] = bound;
  }

  const parallaxAttr = el.getAttribute('data-parallax');
  const elH = el.parentElement.clientHeight;
  const relativity = parallaxAttr === 'relative' ? offsets[i] : ((window.innerHeight - elH) / 2);
  const offsetTop = bound - relativity;
  const coefficent = parallaxAttr !== null && parallaxAttr !== 'relative' ? parallaxAttr : 0.2;
  const maxY = Math.max(-window.innerHeight, offsetTop);
  const baseTransform = Math.floor(Math.min(window.innerHeight, maxY), 2);
  const translateY = baseTransform * parseFloat(coefficent);

  final = Math.round(lerp(final, translateY, 1));
  TweenLite.set(el, { y: final });
};

export default parallax;
