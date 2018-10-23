import Baloon from '../Baloon';

class Crocodile extends Baloon {
  constructor(THREE) {
    super(THREE);
    this.id = 'crocodile';
    this.hasDisplacement = true;
  }
}

export default Crocodile;
