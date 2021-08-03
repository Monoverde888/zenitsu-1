import { BaseSlash } from '../../utils/classes/slash.js';
import { runcode } from './runcode.js';
import { DjsDocs } from './djsdocs.js';

export default async function() {

  const runCode = await runcode();

  class Tools extends BaseSlash {
    constructor() {
      super();
      this.name = 'util'
      this.description = 'Utils'
      this.options = [runCode, DjsDocs()]
    }
  }

  return new Tools();

};
