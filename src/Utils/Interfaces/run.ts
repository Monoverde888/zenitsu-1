import Zenitsu from '../../Utils/Classes/client.js';
import pkg from 'eris-pluris';
import langjsonES from '../Lang/lang-es.js'
import langjsonEN from '../Lang/lang-en.js'

interface run {
    client?: Zenitsu;
    message?: pkg.Message;
    args?: string[];
    embedResponse?(descriptionhere: string, channel?: pkg.TextChannel): Promise<pkg.Message>;
    lang?: 'es' | 'en';
    langjson?: typeof langjsonEN | typeof langjsonES
}

export default run;