import { TimelineMax, Power1, Elastic, TweenMax, Power2 } from 'gsap';
import { degToRad } from './../utils';

class Baloon {
  constructor(THREE) {
    this.THREE = THREE;
    this.id = '';
    this.mesh = null;
    this.hasDisplacement = false;
    this.floatingTimeline = null;
    this.animateInTimeline = null;
    this.animateOutTimeline = null;
  }

  loadModel(cache) {
    return new Promise((resolve) => {
      if (typeof cache[this.id] !== 'undefined') {
        resolve(this.createModel(cache[this.id].geometry, cache[this.id].texture));
      } else {
        fetch(`/static/models/${this.id}/mesh.obj`)
          .then(response => response.text())
          .then((string) => {
            const loader = new this.THREE.OBJLoader();
            const object = loader.parse(string);
            const oGeometry = object.children[0].geometry;
            // Load all the maps
            const textureLoader = new this.THREE.TextureLoader();
            textureLoader.load(`/static/models/${this.id}/color.jpg`, (map) => {
              cache[this.id] = {
                geometry: oGeometry,
                texture: map,
              };
              resolve(this.createModel(oGeometry, map));
            });
          });
      }
    });
  }

  createModel(geometry, map) {
    const material = new this.THREE.MeshPhongMaterial({
      map,
      shininess: this.shininess || 100,
      transparent: true,
      emissive: new this.THREE.Color('rgb(30, 30, 30)'),
      specular: new this.THREE.Color('rgb(18, 18, 18)'),
      side: this.THREE.FrontSide,
    });
    this.mesh = new this.THREE.Mesh(geometry, material);
    this.mesh.rotation.x = degToRad(90);
    return this.mesh;
  }

  animateIn(softEnter) {
    this.animateInTimeline = new TimelineMax();
    this.animateInTimeline.addLabel('start')
      .set(this.mesh.position, { y: -20 })
      .to(this.mesh.position, 8, {
        y: 0,
        ease: Elastic.easeOut.config(softEnter ? 0.5 : 1, 0.5),
      });
  }

  float() {
    this.floatingTimeline = new TimelineMax({ yoyo: true, repeat: -1 });
    this.floatingTimeline.addLabel('start')
      .to(this.mesh.position, 4, {
        y: '-=1',
        ease: Power1.easeInOut,
      }, 'start')
      .fromTo(this.mesh.rotation, 4, {
        y: degToRad(-5),
      }, {
        y: degToRad(5),
        ease: Power1.easeInOut,
      }, 'start')
      .fromTo(this.mesh.rotation, 3, {
        z: degToRad(-5),
      }, {
        z: degToRad(5),
        ease: Power1.easeInOut,
      }, 'start');
  }

  animateOut() {
    return new Promise((resolve) => {
      this.animateOutTimeline = new TimelineMax();
      this.animateOutTimeline.addLabel('start')
        .to(this.mesh.position, 1, {
          z: -15,
          ease: Power2.easeInOut,
        }, 'start')
        .to(this.mesh.rotation, 1, {
          x: degToRad(-60),
          ease: Power2.easeInOut,
        }, 'start')
        .to(this.mesh.material, 1, {
          opacity: 0,
          ease: Power2.easeInOut,
        }, 'start')
        .addCallback(() => resolve());
    });
  }

  applyForce(speed) {
    this.floatingTimeline.pause();
    TweenMax.to(this.mesh.rotation, 2, {
      z: degToRad(speed * 30),
      ease: Power1.easeOut,
    });
  }
}

export default Baloon;
