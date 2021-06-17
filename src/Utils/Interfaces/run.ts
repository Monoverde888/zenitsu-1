import * as  pkg from '@lil_marcrock22/eris-light';
import jsonES from '../Lang/lang-es.js'
import jsonEN from '../Lang/lang-en.js'

interface run {
  message?: pkg.Message;
  args?: string[];
  embedResponse?(descriptionHere: string, option: pkg.TextChannel | pkg.NewsChannel | pkg.PrivateChannel, color: number, options?: pkg.AdvancedMessageContent, files?: pkg.MessageFile[]): Promise<pkg.Message>;
  lang?: 'es' | 'en';
  langjson?: typeof jsonEN | typeof jsonES
  prefix: string;
}

export default run;
