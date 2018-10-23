import Baloon from '../Baloon';

class Flamingo extends Baloon {
  constructor(THREE) {
    super(THREE);
    this.id = 'flamingo';
    this.shininess = 200;
  }
}

export default Flamingo;
