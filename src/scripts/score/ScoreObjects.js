import Crocodile from './baloons/Crocodile';
import Flamingo from './baloons/Flamingo';
import Icecream from './baloons/Icecream';
import Donut from './baloons/Donut';
import Banana from './baloons/Banana';
// import { degToRad } from '../utils';

class ScoreObject {
  constructor(THREE, model, DOMContainer, softEnter = false) {
    this.THREE = THREE;
    this.model = model;
    this.DOMContainer = DOMContainer;
    this.softEnter = softEnter;
    this.config = {
      width: DOMContainer.parentNode.getBoundingClientRect().width,
      height: DOMContainer.parentNode.getBoundingClientRect().height,
    };
    this.models = {};
    this.controls = null;
    this.baloonsList = {
      banana: Banana,
      donut: Donut,
      icecream: Icecream,
      crocodile: Crocodile,
      flamingo: Flamingo,
    };
    this.baloon = null;

    this.isMouseDown = false;
    this.prevMouse = null;
    this.currentMouse = null;
    this.floatingTimeline = null;

    this.renderLoop = () => { this.render(); };
    this.mouseDownHandler = (event) => { this.mouseDown(event); };
    this.mouseUpHandler = (event) => { this.mouseUp(event); };
    this.mouseMoveHandler = (event) => { this.mouseMove(event); };

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.config.width, this.config.height);

    this.scene = new THREE.Scene();
    const rendererWidth = this.renderer.getSize().width;
    const rendererHeight = this.renderer.getSize().height;
    this.camera = new THREE.PerspectiveCamera(75, rendererWidth / rendererHeight, 1, 1000);
  }

  init() {
    // Lights
    const ambientLight = new this.THREE.AmbientLight(0x202020);
    this.scene.add(ambientLight);
    const spotLight = new this.THREE.SpotLight(0xffffff, 0.5);
    this.scene.add(spotLight);
    spotLight.position.set(0, 15, 0);
    const belowLight = new this.THREE.PointLight(0xffffff, 1, 0, 2);
    this.scene.add(belowLight);
    belowLight.position.set(0, -15, 0);
    const frontLight = new this.THREE.PointLight(0xffffff, 0.5, 0, 100);
    frontLight.position.set(0, 2, 30);
    this.scene.add(frontLight);
    // Camera
    this.camera.position.set(0, 0, 13);
    this.camera.rotation.set(0, 0, 0);
    // Append and render
    this.DOMContainer.appendChild(this.renderer.domElement);
    this.renderLoop();

    // Create and append the first baloon
    this.spawn(this.baloonsList[this.model]);
  }

  render() {
    requestAnimationFrame(this.renderLoop);
    this.readSpeed();
    this.renderer.render(this.scene, this.camera);
  }

  spawn(Baloon) {
    const created = new Baloon(this.THREE);
    created.loadModel(this.models).then((mesh) => {
      this.scene.add(mesh);
      created.float();
      created.animateIn(this.softEnter);
      this.baloon = created;
    });
  }

  mouseDown() {
    this.isMouseDown = true;
  }

  mouseUp() {
    this.isMouseDown = false;
  }

  mouseMove(event) {
    this.currentMouse = { x: event.clientX, y: event.clientY, t: performance.now() };
  }

  readSpeed() {
    if (this.prevMouse !== null) {
      const deltaTime = this.currentMouse.t - this.prevMouse.t;
      const deltaPx = this.currentMouse.x - this.prevMouse.x;
      const speed = deltaPx / deltaTime;
      const normalizedSpeed = speed * -1;
      if (this.baloon) {
        this.baloon.applyForce(normalizedSpeed);
      }
    }
    this.prevMouse = this.currentMouse;
  }
}

export default ScoreObject;
