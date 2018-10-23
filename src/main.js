import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import '@modernizr';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');


const bg = [
  'background: linear-gradient(135deg, rgba(0, 0, 0, 1) 0%, rgba(66, 66, 66, 1) 100%);',
  'color:  rgb(255, 88, 41)',
  'padding: 5px 20px',
  'line-height: 25px',
].join(';');
console.log(`%c Adoratorio Summer Club | Lyrics`, bg);

const bg1 = ['background: transparent', 'color: #000', 'padding: 10px 13px', 'line-height: 2px'].join(';');
console.log(
  `
  %cThink we’re late, mate?
  NOPE
  Adoratorio Summer Club
  Is Starting now.

  Summer isn’t over
  Until we say SO!
  Santa can wait
  Or maybe not?
  Fast or Fab
  That’s a DRAMA
  Faster faster faster
  Are you gonna call yo mama?

  Fast, mate:
  pick yo drink
  Hey wow
  hit the BEACH
  GET NO SLEEP
  That’s our Beat.

  Hype- Beast
  Far-east LOVE feast
  We’re a bunch of
  Digital high priests.

  Follow the sound
  Bassetthound
  Battle ground.
  Who’s better?
  Win. No background.

  Think we’re late mate?
  NOPE
  Adoratorio Summer Club
  Get into our hub
  That’s not a jug
  WAIT.
  There’s a BUG
  Unplug!

  That’s a crowd
  Hear us screaming loud?
  Till the clouds!

  Pink Flamingo
  Win the Bing ding Bing Dingo
  Sand, pebble sprinkle
  Donut
  Madonut
  My Donut
  And then?
  Sea
  Banana
  B for BANANA
  B AN AN ANA
  Sun
  Sun sun sun
  Beer mug?
  That’s the designer DRUG.
  Popsicle
  Drops are unstoppable

  Don’t be later
  ALLIGATOR
  Call the waiter.

  You’re old
  We’re not.
  Summer summer
  Beat my drummer
  Summer Club
  Summer isn’t over
  Until we say so

  Counterpoint!
  That’s not my kind
  Summer is our
  STATE OF MIND.
  `, bg1);