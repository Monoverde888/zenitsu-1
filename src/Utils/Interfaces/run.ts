import Zenitsu from '../../Utils/Classes/client.js';
import pkg from 'discord.js-light'
import langjsonES from '../Lang/lang-es.js'
import langjsonEN from '../Lang/lang-en.js'

interface run {
    client?: Zenitsu;
    message?: pkg.Message;
    args?: string[];
    embedResponse?(descriptionhere: string, channel?: pkg.TextChannel): Promise<pkg.Message>;
    Hora?(date: number | Date, dia: boolean): string;
    lang?: 'es' | 'en';
    langjson?: typeof langjsonEN | typeof langjsonES
}

export default run;