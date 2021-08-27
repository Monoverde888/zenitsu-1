import Button from './deprecated-normal.js';
import detritus from 'detritus-client';

class Components {

  components: Button[];
  type: 1;

  constructor(...buttons: Button[]) {

      this.type = 1;
      this.components = [];
      for (const i of buttons) this.components.push(i);

  }
}

export default Components;