import Baloon from '../Baloon';

class Banana extends Baloon {
  constructor(THREE) {
    super(THREE);
    this.id = 'banana';
    this.shininess = 10;
  }
}

export default Banana;
