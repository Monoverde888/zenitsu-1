import * as  pkg from '@lil_marcrock22/eris-light';
import jsonES from '../Lang/lang-es.js'
import jsonEN from '../Lang/lang-en.js'

interface run {
  message?: pkg.Message;
  args?: string[];
  embedResponse?(descriptionhere: string, channel: pkg.TextChannel | pkg.NewsChannel | pkg.PrivateChannel, color: number): Promise<pkg.Message>;
  lang?: 'es' | 'en';
  langjson?: typeof jsonEN | typeof jsonES
  prefix: string;
}

export default run;
